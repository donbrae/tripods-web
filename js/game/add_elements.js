var TRIPODS = (function (mod) {

    // Private functions

    function _addElement(el, layer_element, left, top) {

        if (el) { // If not null

            const svg = document.createElement("svg");

            if (el.defs !== undefined) // Add any defs to SVG element
                svg.insertAdjacentHTML("afterbegin", `<defs>${el.defs}</defs>`);

            if (el.classes !== undefined) { // Add any classes to SVG element
                el.classes.split(" ").forEach(item => {
                    svg.classList.add(item);
                });
            }

            if (el.id !== undefined) // Add any unique id SVG element
                svg.setAttribute("id", el.id);

            svg.insertAdjacentHTML("beforeend", `<${el.shape}></${el.shape}>`);

            if (el.attributes !== undefined) { // Add attributes to SVG shape
                Object.keys(el.attributes).forEach(function (key) {
                    svg.querySelectorAll(el.shape)[0].setAttribute(key, el.attributes[key]);
                });
            }

            if (el.name === "pivitor") {
                top += 5;
                svg.style.opacity = 0;
            }

            svg.style.top = `${top}px`;
            svg.style.left = `${left}px`;

            // Add CSS animations
            if (el.classes && el.classes.indexOf("foot") > -1) { // Feet or pivot element
                const animation = mod.config.animation.default;
                const transition = [];

                [].concat(animation.properties).forEach(property => { // E.g. 'left'
                    transition.push(
                        `${property} ${animation.timing_function} ${animation.duration / 1000}s`
                    );
                });

                svg.style.transition = transition.join(", ");
            }

            layer_element.insertAdjacentHTML("beforeend", svg.outerHTML); // Add SVG shape
        }
    };

    function _addLayer() {
        const container = document.getElementsByClassName("container")[0];
        container.insertAdjacentHTML("beforeend", "<div class=\"layer\"></div>");
        return container.querySelector(".layer:last-of-type");
    };

    function _addControlTouchPadding() { // Adds 'padding' so swipes will be better detected

        const elements = document.querySelectorAll(".control");

        Array.prototype.forEach.call(elements, function (el) {

            // Amend SVG object
            let side = parseFloat(getComputedStyle(el)["width"]);
            let left = parseFloat(getComputedStyle(el)["left"]);
            let top = parseFloat(getComputedStyle(el)["top"]);

            let new_side = side + TRIPODS.ui_attributes.control_padding * 2;
            let shunt = (new_side - side) / 2;

            el.style.width = `${new_side}px`;
            el.style.height = `${new_side}px`;
            el.style.top = `${top - shunt}px`;
            el.style.left = `${left - shunt}px`;

            // Amend actual SVG shape
            let shape_pos = parseFloat(el.querySelectorAll(":first-child")[0].getAttribute("cx"));

            el.querySelectorAll(":first-child")[0].setAttribute("cx", shape_pos + TRIPODS.ui_attributes.control_padding);
            el.querySelectorAll(":first-child")[0].setAttribute("cy", shape_pos + TRIPODS.ui_attributes.control_padding);
        });
    }

    // Public functions

    mod.addElements = function () {

        // > Layer 0 (grid)
        // > If square === 0 add svg_elements.elements.empty

        // Layer 0 (grid)
        let top = 0;
        let layer_element = _addLayer();
        mod.levels[mod.game_state.level].forEach((row, i) => {
            if (i) {
                let left = 0;
                row.forEach(square => {
                    if (
                        square === 0 || // Empty grid square
                        square === 1 || // Foot 1
                        square === 2 || // Foot 2
                        square === 3 // Foot 3
                    )
                        _addElement(mod.config.svg_elements.grid, layer_element, left, top);

                    left += mod.ui_attributes.el_side;
                });
                top += mod.ui_attributes.el_side;
            }
        });

        let three_specific_landing_spots = false; // Each of the three feet has a specific landing spot

        // Layer 1 (blockers, landing spots)
        top = 0;
        layer_element = _addLayer();
        mod.levels[mod.game_state.level].forEach((row, i) => { // Each row
            if (i) { // First row contains colour data
                let left = 0;
                row.forEach(square => { // Each square
                    if (square === 4) { // If this is a blocker element
                        mod.game_state.block_coords.push({ // Store coords (allow for control padding)
                            left: left - TRIPODS.ui_attributes.control_padding,
                            top: top - TRIPODS.ui_attributes.control_padding
                        });
                    }

                    // (See mod.config.linking)
                    if (
                        square === 4 || // Blocker
                        square === 5 || // Landing 1
                        square === 6 || // Landing 2
                        square === 7 // Landing 3
                    ) {

                        if (square === 7)
                            three_specific_landing_spots = true;

                        // Append landing spot colours to relevant elements
                        if (mod.config.linking[square] && mod.config.linking[square].attributes && (square === 5 || square === 6 || square === 7)) {
                            let stroke;
                            switch (square) {
                                case 5:
                                    stroke = mod.levels[mod.game_state.level][0][0];
                                    break;
                                case 6:
                                    stroke = mod.levels[mod.game_state.level][0][1];
                                    break;
                                case 7:
                                    stroke = mod.levels[mod.game_state.level][0][2];
                                    break;
                            }

                            mod.config.linking[square].attributes.stroke = stroke;
                        }
                        _addElement(mod.config.linking[square], layer_element, left, top);
                    }

                    left += mod.ui_attributes.el_side;
                });
                top += mod.ui_attributes.el_side;
            }
        });

        // Layer 2 (interactive UI elements)
        top = 0;
        layer_element = _addLayer();
        mod.levels[mod.game_state.level].forEach((row, i) => {
            if (i) {
                let left = 0;
                row.forEach(square => {
                    if (
                        square === 1 || // Foot 1
                        square === 2 || // Foot 2
                        square === 3 // Foot 3
                    ) {
                        let fill;
                        switch (square) {
                            case 1:
                                fill = mod.levels[mod.game_state.level][0][0];
                                break;
                            case 2:
                                fill = mod.levels[mod.game_state.level][0][1];
                                break;
                            case 3:
                                if (three_specific_landing_spots)
                                    fill = mod.levels[mod.game_state.level][0][2];
                                else
                                    fill = mod.levels[mod.game_state.level][0][1]; // Foot 3 should match foot 2

                                break;
                        }

                        mod.config.linking[square].attributes.fill = fill;

                        _addElement(mod.config.linking[square], layer_element, left, top);
                    }

                    left += mod.ui_attributes.el_side;
                });
                top += mod.ui_attributes.el_side;
            }
        });

        _addElement(mod.config.svg_elements.pivitor, layer_element, 0, 0); // Add pivitor

        _addControlTouchPadding();
    }

    return mod;

}(TRIPODS || {}));

var TRIPODS = (function (mod) {

    // Private functions

    function _addElement(el, layer_element, left, top) {

        if (el) { // If not null

            const svg = document.createElement("svg");

            if (el.defs !== undefined) // Add any defs to SVG element
                svg.insertAdjacentHTML("beforeend", `<defs>${el.defs}</defs>`); // beforeend required for later resizing to work

            if (el.classes !== undefined) { // Add any classes to SVG element
                [].concat(el.classes).forEach(item => {
                    svg.classList.add(item);
                });
            }

            if (el.viewBox !== undefined) // SVG viewBox attribute
                svg.setAttribute("viewBox", el.viewBox);

            if (el.id !== undefined) // Add any unique id SVG element
                svg.setAttribute("id", el.id);

            svg.insertAdjacentHTML("afterbegin", `<${el.shape}></${el.shape}>`); // afterbegin required for later resizing to work

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

    function _addLayer(id) {
        const container = document.getElementsByClassName("container")[0];
        container.insertAdjacentHTML("beforeend", `<div class="layer" id="${id}"></div>`);
        return container.querySelector(".layer:last-of-type");
    };

    function _addControlTouchPadding() { // Adds 'padding' so taps/swipe will be better detected

        const elements = document.querySelectorAll(".control");

        Array.prototype.forEach.call(elements, el => {

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
            console.log(!isNaN(shape_pos));

            if (!isNaN(shape_pos)) {
                el.querySelectorAll(":first-child")[0].setAttribute("cx", shape_pos + TRIPODS.ui_attributes.control_padding);
                el.querySelectorAll(":first-child")[0].setAttribute("cy", shape_pos + TRIPODS.ui_attributes.control_padding);
            }
        });
    }

    // Public functions

    mod.addElements = function () {

        mod.ui_attributes.svg_xy = Math.round(window.innerWidth / mod.levels[mod.game_state.level].length);

        if (window.innerWidth > mod.config.svg_xy_max) {
            mod.ui_attributes.svg_xy = Math.round(mod.config.svg_xy_max / mod.levels[mod.game_state.level].length);
        }

        // Layer 0 (grid)
        let top = 0;
        let layer_element = _addLayer("grid");
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

                    left += mod.ui_attributes.svg_xy;
                });
                top += mod.ui_attributes.svg_xy;
            }
        });

        let three_specific_landing_spots = false; // Each of the three feet has a specific landing spot

        // Layer 1 (blockers, landing spots)
        top = 0;
        layer_element = _addLayer("blockers-landing-spots");

        // Store initial stroke-width of landing feet
        if (!mod.ui_attributes.landing_stroke_width) {
            mod.ui_attributes.landing_stroke_width = mod.config.svg_elements.landing_foot1.attributes["stroke-width"];
        }

        // Adjust control padding for this level
        mod.ui_attributes.control_padding = Math.round(mod.config.control_padding * (mod.ui_attributes.svg_xy / 36));

        mod.levels[mod.game_state.level].forEach((row, i) => { // Each row
            if (i) { // First row contains colour data
                let left = 0;
                row.forEach(square => { // Each square
                    if (square === 4) { // If this is a blocker element
                        mod.game_state.block_coords.push({ // Store coords (allow for control padding)
                            left: left - mod.ui_attributes.control_padding,
                            top: top - mod.ui_attributes.control_padding
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
                                    stroke = mod.levels[mod.game_state.level][0][0]; // Colour
                                    break;
                                case 6:
                                    stroke = mod.levels[mod.game_state.level][0][1];
                                    break;
                                case 7:
                                    stroke = mod.levels[mod.game_state.level][0][2];
                                    break;
                            }

                            mod.config.linking[square].attributes.stroke = stroke;
                            mod.config.linking[square].attributes["stroke-width"] = (mod.ui_attributes.landing_stroke_width * (mod.ui_attributes.svg_xy / 36).toFixed(2));
                        }
                        _addElement(mod.config.linking[square], layer_element, left, top);
                    }

                    left += mod.ui_attributes.svg_xy;
                });
                top += mod.ui_attributes.svg_xy;
            }
        });

        // Layer 2 (interactive UI elements)
        top = 0;
        layer_element = _addLayer("interactive");
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

                    left += mod.ui_attributes.svg_xy;
                });
                top += mod.ui_attributes.svg_xy;
            }
        });

        _addElement(mod.config.svg_elements.pivitor, layer_element, 0, 0); // Add pivitor

        // Set grid area dimensions
        let dimension = mod.ui_attributes.svg_xy * mod.levels[mod.game_state.level][1].length; // Grid height and width

        Array.prototype.forEach.call(document.querySelectorAll(".container"), el => {
            el.style.width = `${dimension}px`;
            el.style.height = `${dimension}px`;
        });

        Array.prototype.forEach.call(document.querySelectorAll(".layer"), el => {
            el.style.width = `${dimension}px`;
            el.style.height = `${dimension}px`;
            Array.prototype.forEach.call(el.querySelectorAll("svg"), svg => {
                svg.style.width = `${mod.ui_attributes.svg_xy}px`;
                svg.style.height = `${mod.ui_attributes.svg_xy}px`;
                if (svg.children[0].nodeName === "circle") {
                    svg.children[0].setAttribute("cx", mod.ui_attributes.svg_xy / 2);
                    svg.children[0].setAttribute("cy", mod.ui_attributes.svg_xy / 2);
                    if (svg.classList.contains("pivitor")) { // Pivotor
                        svg.children[0].setAttribute("r", mod.ui_attributes.svg_xy / 5);
                    } else {
                        svg.children[0].setAttribute("r", mod.ui_attributes.svg_xy / 2.375);
                    }

                } else if (svg.children[0].nodeName === "rect") {
                    svg.children[0].setAttribute("width", mod.ui_attributes.svg_xy);
                    svg.children[0].setAttribute("height", mod.ui_attributes.svg_xy);
                }
            });
        });
        Array.prototype.forEach.call(document.querySelector(".outer-container").children, el => {
            el.style.width = `${dimension}px`;
        });

        _addControlTouchPadding();
    }

    return mod;

}(TRIPODS || {}));

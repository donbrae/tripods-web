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

        // Layer 1
        let top = 0;
        let layer_element = _addLayer();
        mod.levels[mod.game_state.level].forEach(row => { // Each row
            let left = 0;
            row.forEach(square => { // Each square
                if (square === 4) { // If this is a blocker element
                    mod.game_state.block_coords.push({ // Store coords (allow for control padding)
                        left: left - TRIPODS.ui_attributes.control_padding,
                        top: top - TRIPODS.ui_attributes.control_padding
                    });
                }

                if (
                    square === 0 || // Empty square
                    square === 4 || // Blocker
                    square === 5 || // Landing 1
                    square === 6 // Landing other
                ) {
                    _addElement(mod.config.linking[square], layer_element, left, top);
                }

                left += mod.ui_attributes.el_side;
            });
            top += mod.ui_attributes.el_side;
        });

        // Layer 2
        top = 0;
        layer_element = _addLayer();
        mod.levels[mod.game_state.level].forEach(row => {
            let left = 0;
            row.forEach(square => {
                if (
                    square === 1 || // Foot 1
                    square === 2 || // Foot 2
                    square === 3 // Foot 3
                ) {
                    _addElement(mod.config.linking[square], layer_element, left, top);
                }

                left += mod.ui_attributes.el_side;
            });
            top += mod.ui_attributes.el_side;
        });

        _addElement(mod.config.svg_elements.pivitor, layer_element, 0, 0); // Add pivitor

        _addControlTouchPadding();
    }

    return mod;

}(TRIPODS || {}));

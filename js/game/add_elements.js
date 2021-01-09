var TRIPODS = (function (mod) {

    // Private functions

    function _addElement(el, layer_element, left, top) {

        if (el) { // If not null

            const svg = document.createElement("svg");

            if (el.defs !== undefined) // Add any defs to SVG element
                svg.insertAdjacentHTML("afterbegin", `<defs>${el.defs}</defs>`);

            if (el.classes !== undefined)// Add any classes to SVG element
                svg.classList.add(el.classes);

            if (el.id !== undefined) // Add any unique id SVG element
                svg.setAttribute("id", el.id);

            svg.insertAdjacentHTML("beforeend", `<${el.shape}></${el.shape}>`);

            if (el.attributes !== undefined) { // Add attributes to SVG shape
                Object.keys(el.attributes).forEach(function (key) {
                    console.log(key, foo[key]);
                    svg.querySelectorAll(el.shape)[0].setAttribute[key] = el.attributes[key];
                });
            }

            if (el.name === "pivitor") top += 5;

            svg.style.top = `${top}px`;
            svg.style.left = `${left}px`;

            layer_element.insertAdjacentHTML("beforeend", svg[0].outerHTML); // Add SVG shape
        }
    };

    function _addLayer() {
        const container = document.getElementsByClassName("container")[0];
        container.insertAdjacentHTML("beforeend", "<div class=\"layer\"></div>");
        return container.querySelectorAll(".layer:last");
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
            let shape_pos = parseFloat(el.querySelectorAll(":first").getAttribute("cx"));

            el.querySelectorAll(":first").setAttribute("cx", shape_pos + TRIPODS.ui_attributes.control_padding);
            el.querySelectorAll(":first").setAttribute("cy", shape_pos + TRIPODS.ui_attributes.control_padding);
        });
    }

    // Public functions

    mod.addElements = function () {

        function isBlock(obj) {
            if (obj && obj.block !== undefined && obj.block === 1)
                return true;
            else
                return false;
        }

        mod.levels[mod.game_state.level].forEach(layer => { // Each layer
            let top = 0;
            let layer_element = _addLayer();

            layer.forEach(row => { // Each row
                let left = 0;
                row.forEach(square => { // Each square
                    if (isBlock(mod.config.linking[square])) { // If this is a blocker element

                        mod.game_state.block_coords.push({ // Store coords (allow for control padding)
                            left: left - TRIPODS.ui_attributes.control_padding,
                            top: top - TRIPODS.ui_attributes.control_padding
                        });
                    }

                    _addElement(mod.config.linking[square], layer_element, left, top);
                    left += mod.ui_attributes.el_side;
                });

                top += mod.ui_attributes.el_side;
            });
        });

        _addControlTouchPadding();
    }

    return mod;

}(TRIPODS || {}));

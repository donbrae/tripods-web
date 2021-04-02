var TRIPODS = (function (_this) {

    "use strict";

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

            if (el.shapes) { // SVG with multiple <shape>s (for the tutorial 'Tap' element)
                el.shapes.forEach(shape => {
                    svg.insertAdjacentHTML("afterbegin", `<${shape.shape}></${shape.shape}>`);

                    if (shape.attributes !== undefined) { // Add attributes to SVG shape
                        Object.keys(shape.attributes).forEach(function (key) {
                            svg.querySelectorAll(shape.shape)[0].setAttribute(key, shape.attributes[key]);
                        });
                    }
                });

            } else { // SVG has just one shape (i.e. every one except the 'Tap' element)
                svg.insertAdjacentHTML("afterbegin", `<${el.shape}></${el.shape}>`); // afterbegin required for later resizing to work

                if (el.attributes !== undefined) { // Add attributes to SVG shape
                    Object.keys(el.attributes).forEach(function (key) {
                        svg.querySelectorAll(el.shape)[0].setAttribute(key, el.attributes[key]);
                    });
                }
            }

            if (el.name === "pivotor") {
                svg.style.filter = "opacity(0)"; // So pivot initial XY adjustment is hidden
            }

            svg.style.top = `${top}px`;
            svg.style.left = `${left}px`;

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

            let new_side = side + _this.ui_attributes.control_padding * 2;
            let shunt = (new_side - side) / 2;

            el.style.width = `${new_side}px`;
            el.style.height = `${new_side}px`;
            el.style.top = `${top - shunt}px`;
            el.style.left = `${left - shunt}px`;

            // Amend actual SVG shape
            let shape_pos = parseFloat(el.querySelectorAll(":first-child")[0].getAttribute("cx"));

            if (!isNaN(shape_pos)) {
                el.querySelectorAll(":first-child")[0].setAttribute("cx", shape_pos + _this.ui_attributes.control_padding);
                el.querySelectorAll(":first-child")[0].setAttribute("cy", shape_pos + _this.ui_attributes.control_padding);
            }
        });
    }

    // Public functions

    _this.addElements = function () {

        _this.ui_attributes.cell_dimensions = Math.round((window.innerWidth - window.innerWidth / 8) / _this.levels[_this.game_state.level][2].length); // Screen width - padding / number of cells in row

        const wide = window.innerWidth > _this.cfg.grid_max_dimensions;
        const browser_not_tall_enough = _this.cfg.grid_max_dimensions > (window.innerHeight - (_this.cfg.grid_max_dimensions / 3));

        if (wide && !browser_not_tall_enough) {
            _this.ui_attributes.cell_dimensions = Math.round((_this.cfg.grid_max_dimensions - 90) / _this.levels[_this.game_state.level][2].length); // Max grid width - fixed padding / number of cells in row
        } else if (browser_not_tall_enough && window.innerWidth > window.innerHeight) {
            _this.ui_attributes.cell_dimensions = Math.round((_this.cfg.grid_max_dimensions - (_this.cfg.grid_max_dimensions / 3)) / _this.levels[_this.game_state.level][2].length);
        }

        // Layer 0 (grid)
        let top = 0;
        let layer_element = _addLayer("grid");
        _this.levels[_this.game_state.level].forEach((row, i) => {
            if (i > 1) {
                let left = 0;
                row.forEach(square => {
                    if (
                        square === 0 || // Empty grid square
                        square === 1 || // Foot 1
                        square === 2 || // Foot 2
                        square === 3 // Foot 3
                    )
                        _addElement(_this.cfg.svg_elements.grid, layer_element, left, top);

                    left += _this.ui_attributes.cell_dimensions;
                });
                top += _this.ui_attributes.cell_dimensions;
            }
        });

        let three_specific_landing_spots = false; // Each of the three feet has a specific landing spot

        // Layer 1 (blockers, landing spots)
        top = 0;
        layer_element = _addLayer("blockers-landing-spots");

        // Store initial stroke-width of landing feet
        if (!_this.ui_attributes.landing_stroke_width) {
            _this.ui_attributes.landing_stroke_width = _this.cfg.svg_elements.landing_foot1.attributes["stroke-width"];
        }

        // Adjust control padding for this level
        _this.ui_attributes.control_padding = Math.round(_this.cfg.control_padding * (_this.ui_attributes.cell_dimensions / 36));

        _this.levels[_this.game_state.level].forEach((row, i) => { // Each row
            if (i > 1) { // First two rows contain colour and rating data respectively
                let left = 0;
                row.forEach(square => { // Each square

                    // (See _this.cfg.linking)
                    if (
                        square === 4 || // Blocker
                        square === 5 || // Landing 1
                        square === 6 || // Landing 2
                        square === 7 || // Landing 3
                        square === 8 // Vortex
                    ) {

                        if (square === 7)
                            three_specific_landing_spots = true;

                        // Append landing spot colours to relevant elements
                        if (_this.cfg.linking[square] && _this.cfg.linking[square].attributes && (square === 5 || square === 6 || square === 7)) {
                            let stroke;
                            switch (square) {
                                case 5:
                                    stroke = _this.levels[_this.game_state.level][0][0]; // Colour
                                    break;
                                case 6:
                                    stroke = _this.levels[_this.game_state.level][0][1];
                                    break;
                                case 7:
                                    stroke = _this.levels[_this.game_state.level][0][2];
                                    break;
                            }

                            _this.cfg.linking[square].attributes.stroke = stroke;
                            _this.cfg.linking[square].attributes["stroke-width"] = (_this.ui_attributes.landing_stroke_width * (_this.ui_attributes.cell_dimensions / 36).toFixed(2));
                        }
                        _addElement(_this.cfg.linking[square], layer_element, left, top);
                    }

                    left += _this.ui_attributes.cell_dimensions;
                });
                top += _this.ui_attributes.cell_dimensions;
            }
        });

        // Layer 2 (interactive UI elements)
        top = 0;
        layer_element = _addLayer("interactive");
        _this.levels[_this.game_state.level].forEach((row, i) => {
            if (i > 1) {
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
                                fill = _this.levels[_this.game_state.level][0][0];
                                break;
                            case 2:
                                fill = _this.levels[_this.game_state.level][0][1];
                                break;
                            case 3:
                                if (three_specific_landing_spots)
                                    fill = _this.levels[_this.game_state.level][0][2];
                                else
                                    fill = _this.levels[_this.game_state.level][0][1]; // Foot 3 should match foot 2

                                break;
                        }

                        _this.cfg.linking[square].attributes.fill = fill;

                        _addElement(_this.cfg.linking[square], layer_element, left, top);
                    }

                    left += _this.ui_attributes.cell_dimensions;
                });
                top += _this.ui_attributes.cell_dimensions;
            }
        });

        _addElement(_this.cfg.svg_elements.pivotor, layer_element, 0, 0); // Add pivotor

        if (_this.tutorials.levels[_this.game_state.level]) {
            _addElement(_this.cfg.svg_elements.tap, layer_element, 0, 0); // Add tutorial 'tap' element
            document.getElementById("tap").querySelector("text").innerHTML = "Tap";
        }

        // Set grid area dimensions
        let dimension = _this.ui_attributes.cell_dimensions * _this.levels[_this.game_state.level][2].length; // Grid height and width

        const container = document.getElementById("container-grid");
        container.style.width = `${dimension}px`;
        container.style.height = `${dimension}px`;
        container.style.padding = `${Math.round(dimension / 75)}px`;
        container.style.borderRadius = `${Math.round(dimension / 13)}px`;

        Array.prototype.forEach.call(document.querySelectorAll(".layer"), el => {
            el.style.width = `${dimension}px`;
            el.style.height = `${dimension}px`;
            Array.prototype.forEach.call(el.querySelectorAll("svg"), svg => {

                if (svg.id === "tap") {
                    svg.style.width = `${_this.ui_attributes.cell_dimensions * 0.95}px`;
                    svg.style.height = `${_this.ui_attributes.cell_dimensions * 0.6}px`;
                } else {
                    svg.style.width = `${_this.ui_attributes.cell_dimensions}px`;
                    svg.style.height = `${_this.ui_attributes.cell_dimensions}px`;
                    if (svg.children[0].nodeName === "circle") {
                        svg.children[0].setAttribute("cx", _this.ui_attributes.cell_dimensions / 2);
                        svg.children[0].setAttribute("cy", _this.ui_attributes.cell_dimensions / 2);
                        if (svg.id && svg.id === "pivotor") { // Pivotor
                            svg.children[0].setAttribute("r", _this.ui_attributes.cell_dimensions / 5);
                        } else if (svg.classList.contains("grid")) {
                            svg.children[0].setAttribute("r", _this.ui_attributes.cell_dimensions / 2.45);
                        } else {
                            svg.children[0].setAttribute("r", _this.ui_attributes.cell_dimensions / 2.375);
                        }

                    } else if (svg.children[0].nodeName === "rect") {
                        svg.children[0].setAttribute("width", _this.ui_attributes.cell_dimensions);
                        svg.children[0].setAttribute("height", _this.ui_attributes.cell_dimensions);
                    }
                }
            });
        });
        Array.prototype.forEach.call(document.querySelector(".container-game").children, el => {
            el.style.width = `${dimension}px`;
        });

        _addControlTouchPadding();
    }

    return _this;

}(TRIPODS || {}));

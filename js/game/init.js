var TRIPODS = (function (_this) {

    "use strict";

    _this.cfg = {
        // SVG elements for placement on grid
        svg_elements: {
            empty: null,
            grid: {
                name: 'empty',
                shape: 'circle',
                classes: 'grid', // "grid" is a required class
                attributes: { // r, cx and cy set dynamically
                    'stroke-width': 1,
                    'fill-opacity': 0,
                    stroke: '#fff'
                }
            },
            foot1: {
                control: 1,
                name: 'foot1',
                id: 'foot1',
                shape: 'circle',
                classes: ['control', 'foot'],
                attributes: {} // fill, r, cx and cy set dynamically
            },
            foot2: { // Inherits from foot1
                name: 'foot2',
                id: 'foot2'
            },
            foot3: { // Inherits from foot1
                name: 'foot3',
                id: 'foot3'
            },
            block: { // https://iconmonstr.com/cube-3-svg/
                name: 'block',
                shape: 'path',
                classes: ["block"],
                viewBox: "0 0 24 24",
                attributes: { // width and height set dynamically
                    fill: "#5496ff",
                    d: "M12 0l-11 6v12.131l11 5.869 11-5.869v-12.066l-11-6.065zm7.91 6.646l-7.905 4.218-7.872-4.294 7.862-4.289 7.915 4.365zm-6.91 14.554v-8.6l8-4.269v8.6l-8 4.269z",
                    opacity: 0.9
                }
            },
            vortex: { // https://iconmonstr.com/weather-84-svg/
                name: 'vortex',
                shape: 'path',
                classes: ["vortex", "swirl"],
                viewBox: "0 0 24 24",
                attributes: { // width and height set dynamically
                    fill: "#fff",
                    d: "M13.66,5.79A13.73,13.73,0,0,1,24,8.36C22.26,4.08,17.55,1,12,1,7.1,1,2.92,4.08,2.14,8.27s2.16,8.83,8.21,9.92A13.76,13.76,0,0,1,0,15.61C1.73,19.91,6.45,23,12,23h.3c4.83-.1,8.89-3.17,9.64-7.3S19.75,6.88,13.66,5.79Z"
                },
                lose_message: "Ach, the tripod was souked into a vortex.<br><br>Make sure to avoid the vortices as you move to the landing spots."
            },
            landing_foot1: { // Inherits color from foot1
                name: 'landing_foot1',
                shape: 'circle',
                classes: [], // `classes` property requires at least a blank array
                attributes: { // r, cx and cy set dynamically
                    'stroke-width': 4, // Used as input for later calculation. Original value stored in _this.ui_attributes.landing_stroke_width. The value here is round about what it should be for an iPhone 5/SE
                    'fill-opacity': 0,
                    opacity: 0.7
                }
            },
            landing_foot2: { // Inherits from foot 1, and color from foot2
                name: 'landing_foot2',
                classes: [], // `classes` property requires at least a blank array
            },
            landing_foot3: { // Inherits from foot 1, and color from foot3
                name: 'landing_foot3',
                classes: [], // `classes` property requires at least a blank array
            },
            pivitor: { // https://iconmonstr.com/redo-3-svg/
                name: 'pivitor',
                id: 'pivitor',
                shape: 'path',
                classes: ['control', 'pivitor'],
                viewBox: "-13 -14 50 50",
                attributes: {
                    d: "M4.115 5.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.819-2.706-7.297-2.676-10.074.1-2.992 2.993-2.664 7.684.188 10.319l-3.314 3.5c-4.716-4.226-5.257-12.223-.267-17.213z",
                    // class: "pulse",
                    fill: "#fff",
                    opacity: "0.55"
                }
            },
            // tap: { // https://iconmonstr.com/arrow-49-svg/
            //     name: "tap",
            //     id: "tap",
            //     // <text x="2" y="9.5" style="fill: #222; font-family: sans-serif; font-size: 10px;">Tap</text>
            //     classes: ["hide", "fade"],
            //     shape: "path",
            //     viewBox: "0 0 20.7 14.6",
            //     attributes: {
            //         fill: "#fffa8c",
            //         d: "M20.6,10.3V0.2H0.1v10.1l10.3,4.2L20.6,10.3z"
            //     }
            // },
            tap: { // https://iconmonstr.com/arrow-49-svg/
                name: "tap",
                id: "tap",
                // <text x="2" y="9.5" style="fill: #222; font-family: sans-serif; font-size: 10px;">Tap</text>
                classes: ["opacity-0"],
                viewBox: "0 0 20.7 14.6",
                shapes: [
                    {
                        shape: "text", // innerText set in addElements()
                        attributes: {
                            x: 3.9,
                            y: 9.3,
                            fill: "#222",
                            "font-size": "8px",
                            "font-weight": 500
                        }
                    },
                    {
                        shape: "path",
                        attributes: {
                            fill: "#edeaa8",
                            d: "M20.6,10.3V0.2H0.1v10.1l10.3,4.2L20.6,10.3z"
                        }
                    }
                ],
            },
            star: `<svg viewBox="0 0 201 190" class="star"><path id="Star" d="M100.5 5 L69.276 61.524 5.87 73.753 49.979 120.915 42.015 184.997 100.5 157.621 158.985 184.997 151.021 120.915 195.13 73.753 131.724 61.524 Z" fill="#fffa8a" stroke="#fffa8a" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/></svg>`, // via Pixelmator Pro
            star_outline: `<svg viewBox="0 0 201 190" class="star"><path id="Star" d="M100.5 5 L69.276 61.524 5.87 73.753 49.979 120.915 42.015 184.997 100.5 157.621 158.985 184.997 151.021 120.915 195.13 73.753 131.724 61.524 Z" fill="none" stroke="#fffa8a" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/></svg>`
        },
        animation: {
            jump_duration: 210
        },
        grid_max_dimensions: 700,
        control_padding: 8, // (px) Used as input for later calculation. Result stored in _this.ui_attributes.control_padding. The default value here is round about what it should be for an iPhone 5/SE
        logging: false
    }

    _this.ui_attributes = {
        cell_dimensions: 0, // Width and height of (square) SVG element
        control_padding: 0,
        landing_stroke_width: 0 // Original value for reference. Keep default as 0
    };

    _this.init = function () {
        function _extendConfig() { // Adds additional inheriting properties to config obj
            // foot2
            _this.cfg.svg_elements.foot2 = _this.utils.extend({}, _this.cfg.svg_elements.foot1, _this.cfg.svg_elements.foot2);
            _this.cfg.svg_elements.foot2.attributes = _this.utils.extend({}, _this.cfg.svg_elements.foot1.attributes, _this.cfg.svg_elements.foot2.attributes);

            // foot3
            _this.cfg.svg_elements.foot3 = _this.utils.extend({}, _this.cfg.svg_elements.foot1, _this.cfg.svg_elements.foot3);
            _this.cfg.svg_elements.foot3.attributes = _this.utils.extend({}, _this.cfg.svg_elements.foot1.attributes, _this.cfg.svg_elements.foot3.attributes);

            // landing_foot2
            _this.cfg.svg_elements.landing_foot2 = _this.utils.extend({}, _this.cfg.svg_elements.landing_foot1, _this.cfg.svg_elements.landing_foot2);
            _this.cfg.svg_elements.landing_foot2.attributes = _this.utils.extend({}, _this.cfg.svg_elements.landing_foot1.attributes, _this.cfg.svg_elements.landing_foot2.attributes);

            // landing_foot3
            _this.cfg.svg_elements.landing_foot3 = _this.utils.extend({}, _this.cfg.svg_elements.landing_foot1, _this.cfg.svg_elements.landing_foot3);
            _this.cfg.svg_elements.landing_foot3.attributes = _this.utils.extend({}, _this.cfg.svg_elements.landing_foot1.attributes, _this.cfg.svg_elements.landing_foot3.attributes);

            _this.cfg.svg_elements.landing_foot1.classes.push("landing", "landing-1");
            _this.cfg.svg_elements.landing_foot2.classes.push("landing", "landing-2");
            _this.cfg.svg_elements.landing_foot3.classes.push("landing", "landing-3");

            // Links elements to arrangement
            _this.cfg.linking = [
                _this.cfg.svg_elements.empty, // 0
                _this.cfg.svg_elements.foot1, // 1
                _this.cfg.svg_elements.foot2, // 2
                _this.cfg.svg_elements.foot3, // 3
                _this.cfg.svg_elements.block, // 4
                _this.cfg.svg_elements.landing_foot1, // 5
                _this.cfg.svg_elements.landing_foot2, // 6
                _this.cfg.svg_elements.landing_foot3, // 7
                _this.cfg.svg_elements.vortex // 8
            ]
        };

        function _initConfettiCanvas() {
            const canvas = document.getElementById('confetti-canvas');

            canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
        }

        if (!document.querySelector("body").animate) {
            document.querySelector(".screen-landscape").innerHTML = "<h2>Sorry, Tripods requires a more modern browser in order to run.</h2>";
            _this.utils.fadeIn(".screen-landscape");
            return false;
        }

        _extendConfig();
        _initConfettiCanvas();

        _this.utils.fadeOut(".blank-overlay", undefined, true, function () {
            _this.utils.fadeIn(".screen-level-select", undefined, true);
            _this.events.addEventListeners();
            _this.utils.handleOrientation();
        });

        const stored_moves = window.localStorage.getItem("TRIPODS_moves");
        if (stored_moves) {
            _this.game_state.moves = stored_moves.split(",");
        }

        const level = parseInt(window.localStorage.getItem("TRIPODS_level"));
        let index;
        if (level) {
            _this.game_state.level = level;
            index = level + 1;
        } else {
            index = 1;
        }

        _this.addLevelSelect(index);

        if (_this.cfg.logging) {
            document.querySelector(".log").innerHTML = "";
        }

        if (_this.cfg.logging) _this.utils.log("Test log message");
    }

    _this.addLevelSelect = function () {
        const level_buttons_container = document.getElementById("level-buttons");
        const level_buttons = level_buttons_container.querySelectorAll("button");

        // Player must complete levels 1 and 2 (which have tutorials) before 'unlocking' the rest
        const tutorial_1_complete = _this.game_state.moves[0];
        const tutorial_2_complete = _this.game_state.moves[1];

        _this.levels.forEach((_, i) => {
            const moves = parseInt(_this.game_state.moves[i]);
            const threshold = _this.levels[i][1]; // Threshold for ★★★ rating
            let rating;

            if (!isNaN(moves) && moves <= threshold) {
                rating = "★★★";
            } else if (!isNaN(moves) && moves <= threshold * 2) {
                rating = "★★☆";
            } else if (!isNaN(moves) && moves) {
                rating = "★☆☆";
            } else {
                rating = "";
            }

            if (level_buttons.length) {
                level_buttons[i].querySelector(".rating").innerHTML = rating; // Add any update to rating
                if (tutorial_1_complete && i === 1 || tutorial_1_complete && tutorial_2_complete) {
                    level_buttons[i].disabled = false; // Make sure level button isn't disabled
                    level_buttons[i].classList.remove("disabled");
                } else if (i) { // All levels after >= 2 (index >= 1)
                    level_buttons[i].disabled = true; // Disable level button
                    level_buttons[i].classList.add("disabled");
                }
            } else {
                const disabled = !tutorial_1_complete && i || !tutorial_2_complete && i > 1 ? " disabled" : "";
                level_buttons_container.insertAdjacentHTML("beforeend", `<button class="flex-grid-item subtle start${disabled}" data-level="${i}"${disabled}><div class="level">${i + 1}</div><div class="rating">${rating}</div></button>`);
            }
        });
    }

    return _this;

}(TRIPODS || {}));

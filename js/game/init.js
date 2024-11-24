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
                attributes: { // r, cx, cy and stroke-width set dynamically
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
                attributes: { // fill, r, cx and cy set dynamically
                    "clip-path": "url(#hideOuterStroke)"
                },
                defs: `<clipPath id="hideOuterStroke"><circle></circle></clipPath>`
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
            pivotor: { // https://iconmonstr.com/redo-3-svg/
                name: 'pivotor',
                id: 'pivotor',
                shape: 'path',
                classes: ['control', 'pivotor'],
                viewBox: "-13 -14 50 50",
                attributes: {
                    d: "M4.115 5.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.819-2.706-7.297-2.676-10.074.1-2.992 2.993-2.664 7.684.188 10.319l-3.314 3.5c-4.716-4.226-5.257-12.223-.267-17.213z",
                    // class: "pulse",
                    fill: "#fff",
                    opacity: "0.65"
                }
            },
            // <svg viewBox="0 0 20.7 14.6" xmlns="http://www.w3.org/2000/svg"><path d="M20.6,10.3V0.2H0.1v10.1l10.3,4.2L20.6,10.3z" style="fill:#CCFF00;" /><path d="M 5.25 9 L 5.25 4.37 L 3.57 4.37 L 3.57 3.31 L 8.17 3.31 L 8.17 4.37 L 6.46 4.37 L 6.46 9 Z M 9.3 9.07 Q 8.93 9.07 8.62 8.94 Q 8.31 8.81 8.09 8.53 Q 7.87 8.26 7.75 7.85 Q 7.64 7.45 7.64 6.91 Q 7.64 6.18 7.84 5.7 Q 8.05 5.22 8.43 4.98 Q 8.81 4.74 9.3 4.74 Q 9.63 4.74 9.89 4.84 Q 10.15 4.94 10.35 5.12 Q 10.54 5.3 10.63 5.54 L 10.69 5.54 L 10.74 4.82 L 11.84 4.82 L 11.84 9 L 10.69 9 L 10.69 8.27 L 10.63 8.27 Q 10.49 8.63 10.14 8.85 Q 9.79 9.07 9.3 9.07 Z M 9.74 8.14 Q 10.06 8.14 10.27 7.99 Q 10.47 7.85 10.58 7.61 Q 10.68 7.37 10.68 7.1 L 10.68 6.71 Q 10.68 6.43 10.58 6.2 Q 10.47 5.97 10.27 5.82 Q 10.06 5.67 9.74 5.67 Q 9.46 5.67 9.25 5.8 Q 9.04 5.93 8.92 6.21 Q 8.81 6.48 8.81 6.91 Q 8.81 7.32 8.92 7.6 Q 9.04 7.88 9.25 8.01 Q 9.46 8.14 9.74 8.14 Z M 12.91 10.3 L 12.91 4.82 L 14.02 4.82 L 14.06 5.54 L 14.12 5.54 Q 14.27 5.19 14.62 4.96 Q 14.97 4.74 15.45 4.74 Q 15.82 4.74 16.13 4.88 Q 16.44 5.01 16.66 5.29 Q 16.88 5.56 17 5.97 Q 17.13 6.37 17.13 6.91 Q 17.13 7.63 16.92 8.11 Q 16.7 8.59 16.33 8.84 Q 15.95 9.08 15.45 9.08 Q 15.13 9.08 14.86 8.98 Q 14.6 8.88 14.41 8.7 Q 14.22 8.52 14.12 8.27 L 14.06 8.27 L 14.06 10.3 Z M 15.02 8.15 Q 15.3 8.15 15.51 8.01 Q 15.72 7.88 15.83 7.6 Q 15.95 7.33 15.95 6.91 Q 15.95 6.48 15.83 6.21 Q 15.72 5.93 15.51 5.8 Q 15.3 5.67 15.02 5.67 Q 14.7 5.67 14.49 5.82 Q 14.28 5.97 14.18 6.2 Q 14.08 6.43 14.08 6.71 L 14.08 7.11 Q 14.08 7.32 14.13 7.5 Q 14.19 7.68 14.3 7.83 Q 14.42 7.97 14.6 8.06 Q 14.78 8.15 15.02 8.15 Z" style="fill: rgb(33, 33, 33);" /></svg>
            tap: { // https://iconmonstr.com/arrow-49-svg/
                name: "tap",
                id: "tap",
                classes: ["opacity-0"],
                viewBox: "0 0 20.7 14.6",
                shapes: [
                    {
                        shape: "path",
                        attributes: {
                            fill: "#222",
                            d: "M 5.085 9.004 L 5.085 4.374 L 3.405 4.374 L 3.405 3.314 L 8.005 3.314 L 8.005 4.374 L 6.295 4.374 L 6.295 9.004 L 5.085 9.004 Z M 9.135 9.074 C 8.888 9.074 8.662 9.031 8.455 8.944 C 8.248 8.858 8.072 8.721 7.925 8.534 C 7.778 8.354 7.665 8.128 7.585 7.854 C 7.512 7.588 7.475 7.274 7.475 6.914 C 7.475 6.428 7.542 6.024 7.675 5.704 C 7.815 5.384 8.012 5.144 8.265 4.984 C 8.518 4.824 8.808 4.744 9.135 4.744 C 9.355 4.744 9.552 4.778 9.725 4.844 C 9.898 4.911 10.052 5.004 10.185 5.124 C 10.312 5.244 10.405 5.384 10.465 5.544 L 10.525 5.544 L 10.575 4.824 L 11.675 4.824 L 11.675 9.004 L 10.525 9.004 L 10.525 8.274 L 10.465 8.274 C 10.372 8.514 10.208 8.708 9.975 8.854 C 9.742 9.001 9.462 9.074 9.135 9.074 Z M 9.575 8.144 C 9.788 8.144 9.965 8.094 10.105 7.994 C 10.238 7.901 10.342 7.774 10.415 7.614 C 10.482 7.454 10.515 7.284 10.515 7.104 L 10.515 6.714 C 10.515 6.528 10.482 6.358 10.415 6.204 C 10.342 6.051 10.238 5.924 10.105 5.824 C 9.965 5.724 9.788 5.674 9.575 5.674 C 9.388 5.674 9.225 5.718 9.085 5.804 C 8.945 5.891 8.835 6.028 8.755 6.214 C 8.682 6.394 8.645 6.628 8.645 6.914 C 8.645 7.188 8.682 7.418 8.755 7.604 C 8.835 7.791 8.945 7.928 9.085 8.014 C 9.225 8.101 9.388 8.144 9.575 8.144 Z M 12.745 10.304 L 12.745 4.824 L 13.855 4.824 L 13.895 5.544 L 13.955 5.544 C 14.055 5.311 14.222 5.118 14.455 4.964 C 14.688 4.818 14.965 4.744 15.285 4.744 C 15.532 4.744 15.758 4.791 15.965 4.884 C 16.172 4.971 16.348 5.108 16.495 5.294 C 16.642 5.474 16.755 5.701 16.835 5.974 C 16.922 6.241 16.965 6.554 16.965 6.914 C 16.965 7.394 16.895 7.794 16.755 8.114 C 16.608 8.434 16.412 8.678 16.165 8.844 C 15.912 9.004 15.618 9.084 15.285 9.084 C 15.072 9.084 14.875 9.051 14.695 8.984 C 14.522 8.918 14.372 8.824 14.245 8.704 C 14.118 8.584 14.022 8.441 13.955 8.274 L 13.895 8.274 L 13.895 10.304 L 12.745 10.304 Z M 14.855 8.154 C 15.042 8.154 15.205 8.108 15.345 8.014 C 15.485 7.928 15.592 7.791 15.665 7.604 C 15.745 7.424 15.785 7.194 15.785 6.914 C 15.785 6.628 15.745 6.394 15.665 6.214 C 15.592 6.028 15.485 5.891 15.345 5.804 C 15.205 5.718 15.042 5.674 14.855 5.674 C 14.642 5.674 14.465 5.724 14.325 5.824 C 14.185 5.924 14.082 6.051 14.015 6.204 C 13.948 6.358 13.915 6.528 13.915 6.714 L 13.915 7.114 C 13.915 7.254 13.932 7.384 13.965 7.504 C 14.005 7.624 14.062 7.734 14.135 7.834 C 14.215 7.928 14.315 8.004 14.435 8.064 C 14.555 8.124 14.695 8.154 14.855 8.154 Z"
                        }
                    },
                    {
                        shape: "path",
                        attributes: {
                            fill: "#ccff00",
                            d: "M20.6,10.3V0.2H0.1v10.1l10.3,4.2L20.6,10.3z"
                        }
                    }
                ],
            },
            star: `<svg viewBox="0 0 201 190" class="star"><path id="Star" d="M100.5 5 L69.276 61.524 5.87 73.753 49.979 120.915 42.015 184.997 100.5 157.621 158.985 184.997 151.021 120.915 195.13 73.753 131.724 61.524 Z" fill="#fffa8a" stroke="#fffa8a" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/></svg>`, // via Pixelmator Pro
            star_outline: `<svg viewBox="0 0 201 190" class="star"><path id="Star" d="M100.5 5 L69.276 61.524 5.87 73.753 49.979 120.915 42.015 184.997 100.5 157.621 158.985 184.997 151.021 120.915 195.13 73.753 131.724 61.524 Z" fill="none" stroke="#fffa8a" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/></svg>`
        },
        animation: {
            jump_duration: 230
        },
        grid_max_dimensions: 650,
        control_padding: 8, // (px) Used as input for later calculation. Result stored in `_this.ui_attributes.control_padding`. The default value here is round about what it should be for an iPhone 5/SE
        level_buttons_container_spacing_bottom: 17, // To prevent home indicator overlapping bottom of level select grid
        sound: true,
        guides: true, // Helpful indications in UI to show, for example, which feet will pivot next
        logging: false
    }

    _this.ui_attributes = {
        cell_dimensions: 0, // Width and height of (square) SVG element
        grid_dimensions: 0, // Width and height of (square) grid
        control_padding: 0,
        landing_stroke_width: 0, // Original value for reference. Keep default as 0
        guide_stroke_width: 0 // Pivot guides
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
            const screen_landscape = document.querySelector(".screen-landscape");
            screen_landscape.innerHTML = "<h2>Sorry, Tripods requires a more modern browser in order to run.</h2>";
            document.querySelector(".screen-landscape").classList.remove("hide");
            return false;
        }

        _extendConfig();
        _initConfettiCanvas();
        _this.sound.init();

        _this.utils.fadeIn(".screen-level-select", undefined, undefined, function() {
            _this.utils.setLevelSelectGridHeight();
            _this.events.addEventListeners();
            _this.utils.handleOrientation();
            _this.utils.fadeOut(".blank-overlay", 600, true);
        });

        const stored_moves = window.localStorage.getItem("TRIPODS_moves");
        if (stored_moves) {
            _this.game_state.moves = stored_moves.split(",");
        }

        const sound = window.localStorage.getItem("TRIPODS_sound");
        if (sound && sound == "false") {
            _this.game_state.sound = false;
        } else if (sound && sound == "true") {
            _this.game_state.sound = true;
        } else {
            _this.game_state.sound = _this.cfg.sound;
        }

        if (_this.game_state.sound) {
            document.getElementById("sound").classList.add("sound-on");
        } else {
            document.getElementById("sound").classList.add("sound-off");
        }

        const guides = window.localStorage.getItem("TRIPODS_guides");
        if (guides && guides == "false") {
            _this.game_state.guides = false;
        } else if (guides && guides == "true") {
            _this.game_state.guides = true;
        } else {
            _this.game_state.guides = _this.cfg.guides;
        }

        if (_this.game_state.guides) {
            document.getElementById("guides").classList.add("guides-on");
        } else {
            document.getElementById("guides").classList.add("guides-off");
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

        if (_this.cfg.logging) _this.utils.log("init()");

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            _this.game_state.color_scheme = 'dark';
        } else {
            _this.game_state.color_scheme = 'light';
        }
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

var TRIPODS = (function (mod) {

    "use strict";

    mod.cfg = {
        // SVG elements for placement on grid
        svg_elements: {
            empty: null,
            grid: {
                name: 'empty',
                shape: 'circle',
                classes: 'grid',
                attributes: { // r, cx and cy set dynamically
                    'stroke-width': 1,
                    'fill-opacity': 0,
                    stroke: '#ddd'
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
            /*damager: {
              name: 'damager',
              shape: 'polygon',
              attributes: {
                points: '19.6659 3.625 33.8318 11.2178 33.8318 26.4035 19.6659 33.9963 5.5 26.4035 5.5 11.2178',
                fill: '#955050'
              }
            },*/
            block: { // https://iconmonstr.com/cube-3-svg/
                block: true,
                name: 'block',
                shape: 'path',
                viewBox: "0 0 24 24",
                attributes: { // width and height set dynamically
                    fill: "#3a86ff",
                    d: "M12 0l-11 6v12.131l11 5.869 11-5.869v-12.066l-11-6.065zm7.91 6.646l-7.905 4.218-7.872-4.294 7.862-4.289 7.915 4.365zm-6.91 14.554v-8.6l8-4.269v8.6l-8 4.269z",
                    // x: 0,
                    // y: 0,
                    // fill: '#3a86ff'
                }
            },
            landing_foot1: { // Inherits color from foot1
                name: 'landing_foot1',
                shape: 'circle',
                classes: [], // `classes` property requires at least a blank array
                attributes: { // r, cx and cy set dynamically
                    'stroke-width': 4, // Used as input for later calculation. Original value stored in mod.ui_attributes.landing_stroke_width. The value here is round about what it should be for an iPhone 5/SE
                    'fill-opacity': 0,
                    opacity: '0.75'
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
                control: true,
                name: 'pivitor',
                id: 'pivitor',
                shape: 'path',
                classes: 'control',
                viewBox: "-13 -14 50 50",
                attributes: {
                    d: "M4.115 5.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.819-2.706-7.297-2.676-10.074.1-2.992 2.993-2.664 7.684.188 10.319l-3.314 3.5c-4.716-4.226-5.257-12.223-.267-17.213z",
                    class: "pulse",
                    fill: "#222",
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
                classes: "opacity-0",
                viewBox: "0 0 20.7 14.6",
                shapes: [
                    {
                        shape: "text",
                        attributes: {
                            x: 4,
                            y: 9.6,
                            fill: "#222",
                            "font-size": "8px",
                            "font-weight": "500"
                        }
                    },
                    {
                        shape: "path",
                        attributes: {
                            fill: "#fffa8c",
                            d: "M20.6,10.3V0.2H0.1v10.1l10.3,4.2L20.6,10.3z"
                        }
                    }
                ],
            }
        },
        animation: {
            default: {
                properties: ["left", "top"], // array
                timing_function: "linear",
                duration: 120 // milliseconds
            },
            pivot: {
                properties: ["left", "top", "opacity"], // array
                timing_function: "linear",
                duration: 120
            }
        },
        svg_xy_max: 500,
        control_padding: 8 // (px) Used as input for later calculation. Result stored in mod.ui_attributes.control_padding. The default value here is round about what it should be for an iPhone 5/SE
    }

    mod.ui_attributes = {
        svg_xy: 0,
        control_padding: 0,
        landing_stroke_width: 0 // Original value for reference. Keep default as 0
    };

    mod.init = function () {
        function _extendConfig() { // Adds additional inheriting properties to config obj
            // foot2
            mod.cfg.svg_elements.foot2 = TRIPODS.utils.extend({}, mod.cfg.svg_elements.foot1, mod.cfg.svg_elements.foot2);
            mod.cfg.svg_elements.foot2.attributes = TRIPODS.utils.extend({}, mod.cfg.svg_elements.foot1.attributes, mod.cfg.svg_elements.foot2.attributes);

            // foot3
            mod.cfg.svg_elements.foot3 = TRIPODS.utils.extend({}, mod.cfg.svg_elements.foot1, mod.cfg.svg_elements.foot3);
            mod.cfg.svg_elements.foot3.attributes = TRIPODS.utils.extend({}, mod.cfg.svg_elements.foot1.attributes, mod.cfg.svg_elements.foot3.attributes);

            // landing_foot2
            mod.cfg.svg_elements.landing_foot2 = TRIPODS.utils.extend({}, mod.cfg.svg_elements.landing_foot1, mod.cfg.svg_elements.landing_foot2);
            mod.cfg.svg_elements.landing_foot2.attributes = TRIPODS.utils.extend({}, mod.cfg.svg_elements.landing_foot1.attributes, mod.cfg.svg_elements.landing_foot2.attributes);

            // landing_foot3
            mod.cfg.svg_elements.landing_foot3 = TRIPODS.utils.extend({}, mod.cfg.svg_elements.landing_foot1, mod.cfg.svg_elements.landing_foot3);
            mod.cfg.svg_elements.landing_foot3.attributes = TRIPODS.utils.extend({}, mod.cfg.svg_elements.landing_foot1.attributes, mod.cfg.svg_elements.landing_foot3.attributes);

            mod.cfg.svg_elements.landing_foot1.classes.push("landing", "landing-1");
            mod.cfg.svg_elements.landing_foot2.classes.push("landing", "landing-2");
            mod.cfg.svg_elements.landing_foot3.classes.push("landing", "landing-3");

            // Links elements to arrangement
            mod.cfg.linking = [
                mod.cfg.svg_elements.empty, // 0
                mod.cfg.svg_elements.foot1, // 1
                mod.cfg.svg_elements.foot2, // 2
                mod.cfg.svg_elements.foot3, // 3
                mod.cfg.svg_elements.block, // 4
                mod.cfg.svg_elements.landing_foot1, // 5
                mod.cfg.svg_elements.landing_foot2, // 6
                mod.cfg.svg_elements.landing_foot3 // 7
            ]
        };

        function _initConfettiCanvas() {
            const canvas = document.getElementById('confetti-canvas');

            canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
        }

        _extendConfig();

        mod.level_builder.addUI(); // Add UI elements
        // _initConfettiCanvas();
    }

    return mod;

}(TRIPODS || {}));

var TRIPODS = (function (mod) {

    mod.config = {
        // SVG elements for placement on grid
        svg_elements: {
            empty: null,
            grid: {
                name: 'empty',
                shape: 'circle',
                classes: 'grid',
                attributes: { // r, cx and cy set dynamically
                    'stroke-width': '1',
                    'fill-opacity': '0',
                    stroke: '#ddd'
                }
            },
            foot1: {
                control: 1,
                name: 'foot1',
                id: 'foot1',
                shape: 'circle',
                classes: 'control foot',
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
            block: {
                block: 1,
                name: 'block',
                shape: 'rect',
                attributes: { // width and height set dynamically
                    x: '0',
                    y: '0',
                    fill: '#3a86ff'
                }
            },
            landing_foot1: { // Inherits color from foot1
                name: 'landing_foot1',
                shape: 'circle',
                classes: 'landing-1',
                attributes: { // r, cx and cy set dynamically
                    'stroke-width': '4',
                    'fill-opacity': '0',
                    opacity: '0.75'
                }
            },
            landing_foot2: { // Inherits from foot 1, and color from foot2
                name: 'landing_foot2',
            },
            landing_foot3: { // Inherits from foot 1, and color from foot3
                name: 'landing_foot3',
            },
            pivitor: {
                control: 1,
                name: 'pivitor',
                shape: 'circle',
                classes: 'control pivitor',
                attributes: { // r, cx and cy set dynamically
                    fill: '#dddddd',
                    'fill-opacity': .75,
                    filter: 'url(#pivot_blur)',
                    class: 'pulse'
                },
                defs: '<filter height="400%" width="400%" y="-80%" x="-80%" id="pivot_blur">' +
                    '<feGaussianBlur stdDeviation="7" in="SourceGraphic"/>' +
                    '</filter>'
            }
        },
        animation: {
            default: {
                properties: ["left", "top"], // array
                timing_function: "linear",
                duration: 120 // milliseconds
            }
        },
        svg_xy_max: 500
    }

    mod.ui_attributes = {
        svg_xy: null,
        control_padding: 8 // (px)
    };

    mod.init = function () {
        function _extendConfig() { // Adds additional inheriting properties to config obj
            // foot2
            mod.config.svg_elements.foot2 = TRIPODS.utils.extend({}, mod.config.svg_elements.foot1, mod.config.svg_elements.foot2);
            mod.config.svg_elements.foot2.attributes = TRIPODS.utils.extend({}, mod.config.svg_elements.foot1.attributes, mod.config.svg_elements.foot2.attributes);

            // foot3
            mod.config.svg_elements.foot3 = TRIPODS.utils.extend({}, mod.config.svg_elements.foot1, mod.config.svg_elements.foot3);
            mod.config.svg_elements.foot3.attributes = TRIPODS.utils.extend({}, mod.config.svg_elements.foot1.attributes, mod.config.svg_elements.foot3.attributes);

            // landing_foot2
            mod.config.svg_elements.landing_foot2 = TRIPODS.utils.extend({}, mod.config.svg_elements.landing_foot1, mod.config.svg_elements.landing_foot2);
            mod.config.svg_elements.landing_foot2.attributes = TRIPODS.utils.extend({}, mod.config.svg_elements.landing_foot1.attributes, mod.config.svg_elements.landing_foot2.attributes);
            mod.config.svg_elements.landing_foot2.classes = 'landing-2';

            // landing_foot3
            mod.config.svg_elements.landing_foot3 = TRIPODS.utils.extend({}, mod.config.svg_elements.landing_foot1, mod.config.svg_elements.landing_foot3);
            mod.config.svg_elements.landing_foot3.attributes = TRIPODS.utils.extend({}, mod.config.svg_elements.landing_foot1.attributes, mod.config.svg_elements.landing_foot3.attributes);
            mod.config.svg_elements.landing_foot3.classes = 'landing-3';

            // Links elements to arrangement
            mod.config.linking = [
                mod.config.svg_elements.empty, // 0
                mod.config.svg_elements.foot1, // 1
                mod.config.svg_elements.foot2, // 2
                mod.config.svg_elements.foot3, // 3
                mod.config.svg_elements.block, // 4
                mod.config.svg_elements.landing_foot1, // 5
                mod.config.svg_elements.landing_foot2, // 6
                mod.config.svg_elements.landing_foot3 // 7
            ]
        };

        _extendConfig();

        mod.level_builder.addUI(); // Add UI elements
    }

    return mod;

}(TRIPODS || {}));

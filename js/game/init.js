var TRIPODS = (function (mod) {

    mod.config = {
        // SVG elements for placement on grid
        svg_elements: {
            empty: null,
            foot1: {
                control: 1,
                name: 'foot1',
                id: 'foot1',
                shape: 'circle',
                classes: 'control foot',
                attributes: { // Shape attributes
                    cx: '19.5',
                    cy: '19.5',
                    r: '15'
                }
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
                attributes: {
                    x: '0',
                    y: '0',
                    width: '38',
                    height: '38',
                    fill: '#3a86ff'
                }
            },
            landing_foot1: { // Inherits color from foot1
                name: 'landing_foot1',
                shape: 'circle',
                classes: 'landing-1',
                attributes: {
                    'stroke-width': '2.7',
                    'fill-opacity': '0',
                    r: '15',
                    cy: '19.5',
                    cx: '19.5',
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
                attributes: {
                    'stroke-width': 6,
                    stroke: '#dddddd',
                    'fill-opacity': .3,
                    r: '5',
                    cx: '29',
                    cy: '28',
                    filter: 'url(#pivot_blur)',
                    opacity: '0.65',
                    class: 'pulse'
                },
                defs: '<filter height="400%" width="400%" y="-80%" x="-80%" id="pivot_blur">' +
                    '<feGaussianBlur stdDeviation="2.8" in="SourceGraphic"/>' +
                    '</filter>'
            }
        },
        animation: {
            default: {
                properties: ["left", "top"], // array
                timing_function: "linear",
                duration: 120 // milliseconds
            }
        }
    }

    mod.ui_attributes = {
        el_side: 38,
        control_padding: 8
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

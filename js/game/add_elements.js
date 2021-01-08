var TRIPODS = (function (mod) {

    // Private obj

    var $container = $('.container'),
        control_padding = TRIPODS.ui_attributes.control_padding,

        _addElement = function (el, $layer_element, left, top) {

            if (el) { // If not null

                var $svg = $('<svg></svg>');

                if (typeof (el.defs) !== 'undefined') { // Add any defs to SVG element
                    $svg.html('<defs>' + el.defs + '</defs>');
                }

                if (typeof (el.classes) !== 'undefined') { // Add any classes to SVG element
                    $svg.addClass(el.classes);
                }

                if (typeof (el.id) !== 'undefined') { // Add any unique id SVG element
                    $svg.attr('id', el.id);
                }

                $svg.append('<' + el.shape + '></' + el.shape + '>');

                if (typeof (el.attributes) !== 'undefined') { // Add attributes to SVG shape
                    $.each(el.attributes, function (key, value) {
                        $svg.find(el.shape).attr(key, value);
                    });
                }

                if (el.name === 'pivitor') {
                    top += 5;
                }

                $svg.css({ 'top': top + 'px', 'left': left + 'px' });

                $layer_element.append($svg[0].outerHTML); // Add SVG shape
            }
        },

        _addLayer = function () {
            $container.append('<div class="layer"></div>');
            return $container.children('.layer:last');
        },

        _addControlTouchPadding = function () { // Adds 'padding' so swipes will be better detected
            var new_side, shunt, side, left, top, shape_pos, $this;

            $('.control').each(function () {
                $this = $(this);

                // Amend SVG object
                side = parseFloat($this.css('width'));
                left = parseFloat($this.css('left'));
                top = parseFloat($this.css('top'));

                new_side = side + control_padding * 2;
                shunt = (new_side - side) / 2;

                $this.css({ width: new_side + 'px', height: new_side + 'px' });
                $this.css({ top: top - shunt + 'px', left: left - shunt + 'px' });

                // Amend actual SVG shape
                shape_pos = parseFloat($this.children(':first').attr('cx'));
                $this.children(':first')
                    .attr('cx', shape_pos + control_padding)
                    .attr('cy', shape_pos + control_padding);

            });
        }

    // Public obj

    mod.addElements = function () {

        var left = 0, top = 0, // Counters
            $layer_element,

            isBlock = function (obj) {
                if (obj && typeof obj.block !== 'undefined' && obj.block === 1) return true;
            }

        $.each(mod.levels[mod.game_state.level], function () { // Each layer

            top = 0;
            $layer_element = _addLayer();

            $.each(this, function () { // Each row

                left = 0;
                $.each(this, function () { // Each square

                    if (isBlock(mod.config.linking[this])) { // If this is a blocker element

                        mod.game_state.block_coords.push({ // Store coords (allow for control padding)
                            left: left - control_padding,
                            top: top - control_padding
                        });
                    }

                    _addElement(mod.config.linking[this], $layer_element, left, top);
                    left += mod.ui_attributes.el_side;
                });

                top += mod.ui_attributes.el_side;
            });
        });

        _addControlTouchPadding();
    }

    return mod;

}(TRIPODS || {}));

// Before refactor: https://github.com/donbrae/tripods-web/blob/5521e55afc7269226db453759c4b6242813f03e6/js/game/mvt.js

TRIPODS.mvt = (function (_module) {

    "use strict";

    const _this = {
        measurements: {
            container_rect: undefined,
            cells_in_row: undefined,
            cells_in_column: undefined
        }
    };

    const foot_pivot_sequence = [
        ['left', '+'],
        null,
        ['top', '+'],
        ['top', '+'],
        null,
        ['left', '-'],
        ['left', '-'],
        null,
        ['top', '-'],
        ['top', '-'],
        null,
        ['left', '+']
    ];

    let orig_pos_x;
    let orig_pos_y;
    let block_collide;
    let vortex_collide;

    let block_collide_via_pivot;
    let vortex_collide_via_pivot;
    let vortex_data;

    const foot_move_data = [];
    let count_foot1;
    let count_foot2;
    let count_foot3;

    let pivot_timeout = undefined; // Don't show pivot during quick succession of jumps

    // Foot hits one of the four walls
    function boundaryIntersected(x_shift, y_shift) {
        const stroke_width = parseFloat(getComputedStyle(document.querySelector("#foot1 > circle"))["stroke-width"]);
        const control_padding = _module.ui_attributes.control_padding - stroke_width;
        const container_padding = parseFloat(document.getElementById("container-grid").style.padding);
        const foot_width_height = document.querySelector("#foot1 > :first-child").getBoundingClientRect().width;

        // console.log("left: ", orig_pos_x + control_padding + x_shift - container_padding + foot_width_height, _this.measurements.container_rect.x);
        // console.log("right: ", orig_pos_x + control_padding + x_shift + container_padding + foot_width_height, _this.measurements.container_rect.right);
        // console.log("top: ", orig_pos_y + control_padding + y_shift - container_padding + foot_width_height, _this.measurements.container_rect.y);
        // console.log("bottom: ", orig_pos_y + control_padding + y_shift + container_padding + foot_width_height, _this.measurements.container_rect.bottom);

        // These conditionals calculate whether the full foot would clear the boundary
        if (orig_pos_x + control_padding + x_shift - container_padding + foot_width_height < _this.measurements.container_rect.x) return "left"; // Hits left container boundary (x_shift will be a minus value)
        else if (orig_pos_x + control_padding + x_shift + container_padding + foot_width_height > _this.measurements.container_rect.right) return "right";
        else if (orig_pos_y + control_padding + y_shift - container_padding + foot_width_height < _this.measurements.container_rect.y) return "top";
        else if (orig_pos_y + control_padding + y_shift + container_padding + foot_width_height > _this.measurements.container_rect.bottom) return "bottom";

        return false;
    };

    function collided(cx, cy, coords = _module.game_state.block_center_coords) {
        let collide = false;

        for (let i = 0; i < coords.length; i++) {
            const block = coords[i];
            if (Math.abs(block.x - cx) <= 10 && Math.abs(block.y - cy) <= 10) {
                collide = true;
                break;
            }
        }

        return collide;
    }

    // Update counter for each foot to keep track of where it is in the foot_pivot_sequence
    function updatePivotCounter(foot, val) {
        switch (foot) {
            case "foot1":
                count_foot1 = val;
                break;
            case "foot2":
                count_foot2 = val;
                break;
            case "foot3":
                count_foot3 = val;
        }
    }

    function moveSuccess() {

        _module.game_state.updateMoveCounter();
        _module.game_state.checkWin();

        _this.getNextPivot();

        if (_module.game_state.tutorial_running && _module.tutorials.checkFollow())
            setTimeout(() => { // Delay to allow pivot to reposition
                _module.tutorials.placeTutorialElement();
            }, 300);
        else if (_module.game_state.tutorial_running)
            _module.tutorials.finish();
    }

    function animateVortex(vortex, callback) {

        const blur = _module.ui_attributes.cell_dimensions * 0.001;
        // Animate foot that has collided with vortex
        const foot = document.getElementById(vortex.foot_id);
        foot.style["z-index"] = getComputedStyle(foot).zIndex - 1000;
        const translate_xy = _module.utils.getTranslateXY(foot); // Get current relative position of foot
        const keyframes = [
            { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px) scale(1)` },
            { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px) scale(0)` },
        ];
        _module.utils.animate(foot, keyframes, { duration: 400, easing: "ease-in" });
        _module.sound.play("vortex");

        // Animate other foot
        Array.prototype.forEach.call(document.querySelectorAll(".foot"), foot => {
            if (foot.getAttribute("id") !== vortex.foot_id) {
                const translate_xy = _module.utils.getTranslateXY(foot); // Get current relative position of foot
                const foot_center = _module.utils.getCenterPoint(foot); // xy of foot centre point
                const foot_vortex_shift_x = vortex.x - foot_center.x;
                const foot_vortex_shift_y = vortex.y - foot_center.y;
                const move_to_x = translate_xy.tX + foot_vortex_shift_x; // Number of px to shift x
                const move_to_y = translate_xy.tY + foot_vortex_shift_y; // Number of px to shift y

                const keyframes = [
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px) scale(1)`, filter: `blur(${blur}rem)` }, // Current position of foot
                    { transform: `translate(${move_to_x}px,${move_to_y}px) scale(0.7)`, filter: `blur(${blur}rem)` },
                    { transform: `translate(${move_to_x}px,${move_to_y}px) scale(0)`, filter: `blur(0)` }
                ];

                _module.utils.animate(foot, keyframes, { duration: 600, easing: "ease-in" }, () => {
                    if (typeof (callback) == "function") {
                        setTimeout(callback, 300);
                    };
                });
            }
        });
    }

    function hideTutorialLabel() {
        if (_module.game_state.tutorial_running) {

            const animation = _module.tutorials.animate_tap;
            const delay = animation.effect.getComputedTiming().delay;

            if (animation.currentTime < delay) { // If 'Tap' label animation hasn't begun yet
                animation.cancel();
                _module.utils.fadeOut("#tap", 130); // Hide tutorial label
            } else {
                _module.utils.fadeOut("#tap", 130, undefined, () => {
                    _module.tutorials.animate_tap.cancel();
                }); // Hide tutorial label
            }
        }
    }

    // Clear any pivot indicators
    function clearNextPivotIndicators() {
        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            el.classList.add("will-pivot-fade");
        });
    }

    // Hide any pivot indicators
    function hideNextPivotIndicators() {
        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            if (!el.classList.contains("will-pivot-fade")) {
                el.classList.add("will-pivot-fade", "will-pivot-hide");
            }
        });
    }

    // Hide any hidden pivot indicators
    function showNextPivotIndicators() {
        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            if (el.classList.contains("will-pivot-hide")) {
                el.classList.remove("will-pivot-fade", "will-pivot-hide");
            }
        });
    }

    _this.getMeasurements = function () {
        if (!isNaN(_module.game_state.level)) {
            this.measurements.container_rect = document.getElementById("container-grid").getBoundingClientRect();
            this.measurements.cells_in_row = _module.levels[_module.game_state.level][1].length;
            this.measurements.cells_in_column = _module.levels[_module.game_state.level].length - 1;
        }
    }

    // Works out where each foot should be in the foot_pivot_sequence
    _this.calculatePivotState = function () {
        const a_foot = _this.getAFoot();
        const foot_id = a_foot.getAttribute('id');
        const a_foot_ctr_pt = _module.utils.getCenterPoint(a_foot);
        const other_feet = [];
        const foot1_ctr = _module.utils.getCenterPoint(document.getElementById("foot1"));
        const foot2_ctr = _module.utils.getCenterPoint(document.getElementById("foot2"));
        const foot3_ctr = _module.utils.getCenterPoint(document.getElementById("foot3"));

        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            if (el.getAttribute('id') !== a_foot.getAttribute('id')) {
                other_feet.push(_module.utils.getCenterPoint(el));
            }
        });

        if (other_feet[0].y === other_feet[1].y) {	// If other feet are at same position on y axis
            if (other_feet[0].y > a_foot_ctr_pt.y) { // 'A' foot in pos. 0

                updatePivotCounter(foot_id, 0); // Set 'A' foot to position 0

                // Set the other two feet
                if (foot_id === "foot1") {
                    if (foot3_ctr.x < foot2_ctr.x) {
                        updatePivotCounter("foot2", 4);
                        updatePivotCounter("foot3", 8);
                    } else if (foot3_ctr.x > foot2_ctr.x) {
                        updatePivotCounter("foot2", 8);
                        updatePivotCounter("foot3", 4);
                    }
                } else if (foot_id === "foot2") {
                    if (foot1_ctr.x < foot3_ctr.x) {
                        updatePivotCounter("foot1", 8);
                        updatePivotCounter("foot3", 4);
                    } else if (foot1_ctr.x > foot3_ctr.x) {
                        updatePivotCounter("foot1", 4);
                        updatePivotCounter("foot3", 8);
                    }
                } else if (foot_id === "foot3") {
                    if (foot2_ctr.x < foot1_ctr.x) {
                        updatePivotCounter("foot1", 4);
                        updatePivotCounter("foot2", 8);
                    } else if (foot2_ctr.x > foot1_ctr.x) {
                        updatePivotCounter("foot1", 8);
                        updatePivotCounter("foot2", 4);
                    }
                }

            } else { // A foot in pos. 6

                updatePivotCounter(foot_id, 6);

                if (foot_id === "foot1") {
                    if (foot3_ctr.x < foot2_ctr.x) {
                        updatePivotCounter("foot2", 2);
                        updatePivotCounter("foot3", 10);
                    } else if (foot3_ctr.x > foot2_ctr.x) {
                        updatePivotCounter("foot2", 10);
                        updatePivotCounter("foot3", 2);
                    }
                } else if (foot_id === "foot2") {
                    if (foot1_ctr.x < foot3_ctr.x) {
                        updatePivotCounter("foot1", 10);
                        updatePivotCounter("foot3", 2);
                    } else if (foot1_ctr.x > foot3_ctr.x) {
                        updatePivotCounter("foot1", 2);
                        updatePivotCounter("foot3", 10);
                    }
                } else if (foot_id === "foot3") {
                    if (foot2_ctr.x < foot1_ctr.x) {
                        updatePivotCounter("foot1", 2);
                        updatePivotCounter("foot2", 10);
                    } else if (foot2_ctr.x > foot1_ctr.x) {
                        updatePivotCounter("foot1", 10);
                        updatePivotCounter("foot2", 2);
                    }
                }
            }
        } else if (other_feet[0].x === other_feet[1].x) { // If other feet match on the x axis

            if (other_feet[0].x > a_foot_ctr_pt.x) {

                // Pos. 8
                updatePivotCounter(foot_id, 9);

                if (foot_id === "foot1") {
                    if (foot3_ctr.y < foot2_ctr.y) {
                        updatePivotCounter("foot2", 5);
                        updatePivotCounter("foot3", 1);
                    } else if (foot3_ctr.y > foot2_ctr.y) {
                        updatePivotCounter("foot2", 1);
                        updatePivotCounter("foot3", 5);
                    }
                } else if (foot_id === "foot2") {
                    if (foot1_ctr.y < foot3_ctr.y) {
                        updatePivotCounter("foot1", 1);
                        updatePivotCounter("foot3", 5);
                    } else if (foot1_ctr.y > foot3_ctr.y) {
                        updatePivotCounter("foot1", 5);
                        updatePivotCounter("foot3", 1);
                    }
                } else if (foot_id === "foot3") {
                    if (foot2_ctr.y < foot1_ctr.y) {
                        updatePivotCounter("foot1", 5);
                        updatePivotCounter("foot2", 1);
                    } else if (foot2_ctr.y > foot1_ctr.y) {
                        updatePivotCounter("foot1", 1);
                        updatePivotCounter("foot2", 5);
                    }
                }
            } else {

                // Pos. 3
                updatePivotCounter(foot_id, 3);

                if (foot_id === "foot1") {
                    if (foot3_ctr.y < foot2_ctr.y) {
                        updatePivotCounter("foot2", 7);
                        updatePivotCounter("foot3", 11);
                    } else if (foot3_ctr.y > foot2_ctr.y) {
                        updatePivotCounter("foot2", 11);
                        updatePivotCounter("foot3", 7);
                    }
                } else if (foot_id === "foot2") {
                    if (foot1_ctr.y < foot3_ctr.y) {
                        updatePivotCounter("foot1", 11);
                        updatePivotCounter("foot3", 7);
                    } else if (foot1_ctr.y > foot3_ctr.y) {
                        updatePivotCounter("foot1", 7);
                        updatePivotCounter("foot3", 11);
                    }
                } else if (foot_id === "foot3") {
                    if (foot2_ctr.y < foot1_ctr.y) {
                        updatePivotCounter("foot1", 7);
                        updatePivotCounter("foot2", 11);
                    } else if (foot2_ctr.y > foot1_ctr.y) {
                        updatePivotCounter("foot1", 11);
                        updatePivotCounter("foot2", 7);
                    }
                }
            }
        }
    }

    // Work out which foot is at the 'A' point of the triangle
    _this.getAFoot = function () {

        let foot;

        function compareToOtherFeet(foot) {

            const angles = [];
            let is_foot_a = true; // Flag. Where 'a' is 'top' point of isosceles triangle

            Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) { // For each of the other two feet
                if (el.getAttribute("id") !== foot.getAttribute("id"))
                    angles.push(_module.utils.getAngleEl(foot, el));
            });

            // Compare the two angles
            for (let i = 0; i < angles.length; i++) {
                const angle = angles[i];
                if (angle === 0 || angle === 90 || angle === 180 || angle === -90) {
                    is_foot_a = false;
                    break
                }
            }

            return is_foot_a;
        }

        // Get A point of triangle
        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            if (compareToOtherFeet(el)) { // If 'A' foot
                foot = el;
                return false;
            }
        });

        return foot;
    }

    _this.repositionPivot = function (fade_in, delay = 300) {

        const pivot = document.getElementById("pivotor");
        const pivot_rect = pivot.getBoundingClientRect();

        const foot1 = document.getElementById("foot1");
        const foot2 = document.getElementById("foot2");
        const foot3 = document.getElementById("foot3");

        const angle_1_2 = Math.round(_module.utils.getAngleEl(foot1, foot2));
        const angle_1_3 = Math.round(_module.utils.getAngleEl(foot1, foot3));

        let pivot_shift_x;
        let pivot_shift_y;

        const side = _module.ui_attributes.cell_dimensions;
        const shunt = Math.round(_module.ui_attributes.cell_dimensions / 6);

        let foot_rect;

        switch (true) {
            case angle_1_2 === 63 && angle_1_3 === 117: // Position 1 (clockwise arrangement 1, 2, 3)
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y + side + shunt;
                break;
            case angle_1_2 === 90 && angle_1_3 === 153: // Position 2
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x + side + shunt;
                break;
            case angle_1_2 === 117 && angle_1_3 === 180: // Position 3
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y - side - shunt;
                break;
            case angle_1_2 === 153 && angle_1_3 === - 153: // Position 4
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                break;
            case angle_1_2 === 180 && angle_1_3 === - 117: // Position 5
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y + side + shunt;
                break;
            case angle_1_2 === - 153 && angle_1_3 === - 90: // Position 6
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x + side + shunt;
                break;
            case angle_1_2 === - 117 && angle_1_3 === - 63: // Position 7
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y - side - shunt;
                break;
            case angle_1_2 === - 90 && angle_1_3 === - 27: // Position 8
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                break;
            case angle_1_2 === - 63 && angle_1_3 === 0: // Position 9
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y + side + shunt;
                break;
            case angle_1_2 === - 27 && angle_1_3 === 27: // Position 10
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x + side + shunt;
                break;
            case angle_1_2 === 0 && angle_1_3 === 63: // Position 11
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y - side - shunt;
                break;
            case angle_1_2 === 27 && angle_1_3 === 90: // Position 12
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                break;
            case angle_1_3 === 63 && angle_1_2 === 117: // Position 1 (clockwise 1, 3, 2)
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y + side + shunt;
                break;
            case angle_1_3 === 90 && angle_1_2 === 153: // Position 2
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x + side + shunt;
                break;
            case angle_1_3 === 117 && angle_1_2 === 180: // Position 3
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y - side - shunt;
                break;
            case angle_1_3 === 153 && angle_1_2 === - 153: // Position 4
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                break;
            case angle_1_3 === 180 && angle_1_2 === - 117: // Position 5
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y + side + shunt;
                break;
            case angle_1_3 === - 153 && angle_1_2 === - 90: // Position 6
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x + side + shunt;
                break;
            case angle_1_3 === - 117 && angle_1_2 === - 63: // Position 7
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y - side - shunt;
                break;
            case angle_1_3 === - 90 && angle_1_2 === - 27: // Position 8
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                break;
            case angle_1_3 === - 63 && angle_1_2 === 0: // Position 9
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y + side + shunt;
                break;
            case angle_1_3 === - 27 && angle_1_2 === 27: // Position 10
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x + side + shunt;
                break;
            case angle_1_3 === 0 && angle_1_2 === 63: // Position 11
                foot_rect = foot2.getBoundingClientRect();
                pivot_shift_x = foot_rect.x - pivot_rect.x;
                pivot_shift_y = foot_rect.y - pivot_rect.y - side - shunt;
                break;
            case angle_1_3 === 27 && angle_1_2 === 90: // Position 12
                foot_rect = foot3.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                break;
            default:
                // Place near foot 1
                foot_rect = foot1.getBoundingClientRect();
                pivot_shift_y = foot_rect.y - pivot_rect.y;
                pivot_shift_x = foot_rect.x - pivot_rect.x - side - shunt;
                console.error("Pivot position could not be calculated");
        }

        const translate_xy = _module.utils.getTranslateXY(pivot);

        const keyframes = [
            { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial (0,0) or current x_shift and y_shift for the pivotor
            { transform: `translate(${translate_xy.tX + pivot_shift_x}px,${translate_xy.tY + pivot_shift_y}px)` }
        ];

        const cb = fade_in ? () => {
            pivot_timeout = setTimeout(() => {
                if (!_module.game_state.level_end) {
                    _module.utils.fadeIn("#pivotor");
                }
            }, delay);
        } : null;

        _module.utils.animate(pivot, keyframes, {
            duration: _module.cfg.animation.jump_duration
        }, cb);
    }

    _this.getNextPivot = function () {
        /**
         * @param {String} foot - ID of element
         * @param {Number} count
         */
        function checkWhichFeetShouldPivot(foot, count) {

            if (foot_pivot_sequence[count] !== null) { // If foot should move

                let shift; // Where feet will move to if the move is valid (e.g. doesn't encounter blocker UI element)

                if (foot_pivot_sequence[count][0] === "left") {

                    let foot_shift_x;

                    // Get new foot coords
                    if (foot_pivot_sequence[count][1] === "-") foot_shift_x = - _module.ui_attributes.cell_dimensions;
                    else if (foot_pivot_sequence[count][1] === "+") foot_shift_x = _module.ui_attributes.cell_dimensions;

                    shift = { x: foot_shift_x, y: 0 }; // Store parameters for animation

                } else if (foot_pivot_sequence[count][0] === "top") {

                    let foot_shift_y;

                    if (foot_pivot_sequence[count][1] === "-") foot_shift_y = - _module.ui_attributes.cell_dimensions;
                    else if (foot_pivot_sequence[count][1] === "+") foot_shift_y = _module.ui_attributes.cell_dimensions;

                    shift = { x: 0, y: foot_shift_y };
                }

                foot_move_data.push({
                    foot: foot, // Element ID
                    move: true,
                    count: count,
                    shift: shift // x,y
                });

                const foot_center_point = _module.utils.getCenterPoint(document.getElementById(foot));
                const move_to_x = foot_center_point.x + shift.x;
                const move_to_y = foot_center_point.y + shift.y;

                block_collide = collided(move_to_x, move_to_y);

                if (block_collide) {
                    block_collide_via_pivot = true;
                } else {
                    vortex_collide = collided(move_to_x, move_to_y, _module.game_state.vortex_center_coords);
                    if (vortex_collide) {
                        vortex_collide_via_pivot = true;
                        vortex_data = {
                            foot_id: foot, // ID of foot that has collided with vortex
                            x: move_to_x,
                            y: move_to_y
                        }
                    }
                }
            } else if (foot_pivot_sequence[count] === null) { // If foot isn't to move this time
                foot_move_data.push({
                    foot: foot, // Element ID
                    move: false,
                    count: count
                });
            }
        };

        foot_move_data.length = 0;

        block_collide_via_pivot = false;
        vortex_collide_via_pivot = false;

        // Which feet should move?
        checkWhichFeetShouldPivot("foot1", count_foot1);
        checkWhichFeetShouldPivot("foot2", count_foot2);
        checkWhichFeetShouldPivot("foot3", count_foot3);

        // Highlight feet that will pivot
        foot_move_data.forEach(item => {
            if (item.move) {
                document.getElementById(item.foot).classList.remove("will-pivot-fade");
            }
        });
    }

    // Pivot

    _this.pivot = function (e) {

        if (_module.game_state.ignore_user_input || _module.game_state.level_end) {
            return false;
        }

        _module.game_state.element_tapped = `#${e.currentTarget.id}`;
        hideTutorialLabel();

        let pivot_foot_count = 0;

        function postPivot(foot, count) {
            updatePivotCounter(foot, count);
            pivot_foot_count++;
        };

        function finishPivot(foot_move) {
            if (foot_move.move) {

                const foot = document.getElementById(foot_move.foot);
                const translate_xy = _module.utils.getTranslateXY(foot);

                const keyframes = [
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x}px,${translate_xy.tY + foot_move.shift.y}px) `, filter: `blur(${_module.ui_attributes.cell_dimensions * 0.001}rem)` }, // Destination
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x * 1.06}px,${translate_xy.tY + foot_move.shift.y * 1.06}px)` }, // Overswing
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x}px,${translate_xy.tY + foot_move.shift.y}px)`, filter: "blur(0)" }, // Destination
                ];

                _module.utils.animate(foot, keyframes, { duration: 250 }, () => { postPivot(foot_move.foot, foot_move.count); });

            } else postPivot(foot_move.foot, foot_move.count);
        };

        function abortPivot(foot_move) {

            if (foot_move.move) {

                const foot = document.getElementById(foot_move.foot);
                const translate_xy = _module.utils.getTranslateXY(foot);

                const keyframes = [
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x / 4}px,${translate_xy.tY + foot_move.shift.y / 4}px)`, filter: `blur(${_module.ui_attributes.cell_dimensions * 0.001}rem)` }, // Hit block
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                    { transform: `translate(${translate_xy.tX - foot_move.shift.x / 8}px,${translate_xy.tY - foot_move.shift.y / 8}px)` }, // Overswing
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0)" } // Initial
                ];

                _module.utils.animate(foot, keyframes, { duration: 200 }, () => {
                    pivot_foot_count++;
                });

            } else {
                pivot_foot_count++;
            }
        };

        function startPivot(callback) {
            _module.game_state.ignore_user_input = true;

            foot_move_data.forEach(item => {
                // Amend count
                if (item.count === 11) item.count = 0;
                else item.count++;

                if (typeof (callback) == "function") callback(item);
            });
        };

        if (_module.game_state.ignore_user_input) return false;

        const pivot_check = setInterval(function () { // Check for completion of pivot

            if (pivot_foot_count === 3 && !block_collide_via_pivot && !vortex_collide_via_pivot) {
                _this.repositionPivot();
                _module.game_state.ignore_user_input = false;
                clearInterval(pivot_check);
                moveSuccess();
            } else if (pivot_foot_count === 3 && block_collide_via_pivot) {
                _module.game_state.ignore_user_input = false;
                clearInterval(pivot_check);
            } else if (pivot_foot_count === 3 && vortex_collide_via_pivot) {
                clearInterval(pivot_check);
                animateVortex(vortex_data, () => {
                    _module.level_builder.showLoseScreen(_module.cfg.svg_elements.vortex.lose_message);
                });
            }
        }, 25);

        if (!block_collide_via_pivot && !vortex_collide_via_pivot) {
            startPivot(finishPivot); // If no block go pivot
            _module.sound.play("pivot");
            clearNextPivotIndicators();
        } else if (block_collide_via_pivot) {
            startPivot(abortPivot); // Don't pivot
            _module.sound.play("block_collide_pivot", _module.cfg.animation.jump_duration * 0.12);
        } else if (vortex_collide_via_pivot) {
            _module.game_state.level_end = true;
            _module.utils.fadeOutAndDisable(".info-panel .hame");
            _module.utils.fadeOut("#sound", 100);
            _module.utils.fadeOut("#guides", 100);
            _module.utils.fadeOut("#pivotor");
            startPivot(finishPivot);
            _module.sound.play("pivot");
            clearNextPivotIndicators();
            // pivot_check() will run animateVortex() etc.
        }
    }

    // Swipe

    _this.swipe = function (e) {

        if (_module.game_state.ignore_user_input || _module.game_state.level_end) {
            return false;
        }

        _module.game_state.element_tapped = `#${e.currentTarget.id}`;
        hideTutorialLabel();

        const cell_len = _module.ui_attributes.cell_dimensions;
        const foot = document.getElementById(e.currentTarget.id);

        // Move the swiped foot (left and top arguments are the destination coords)
        function jump(foot, x_shift, y_shift, callback) {
            _module.game_state.ignore_user_input = true;

            _module.utils.fadeOut("#pivotor");

            const translate_xy = _module.utils.getTranslateXY(foot);

            const keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: `blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))` },
                { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: `blur(${_module.ui_attributes.cell_dimensions / 500}rem) drop-shadow(${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 20}px rgba(0, 0, 0, 0.05))` }, // Halfway
                { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }
            ];

            _module.utils.animate(foot, keyframes, { duration: _module.cfg.animation.jump_duration }, callback);
        };

        function jumpBoundary(foot, x_shift, y_shift, swipe_angle, callback) {
            _module.game_state.ignore_user_input = true;

            _module.utils.fadeOut("#pivotor");

            const translate_xy = _module.utils.getTranslateXY(foot);
            let x_shift_additional = 0;
            let y_shift_additional = 0;

            const control_padding = _module.ui_attributes.control_padding;
            const container_padding = parseFloat(document.getElementById("container-grid").style.padding);
            const foot_rect = foot.getBoundingClientRect();

            const shift_halfway = { // Halfway point of a full jump
                x: x_shift / 2,
                y: y_shift / 2
            }

            switch (swipe_angle) {
                case "n":
                    y_shift_additional = -Math.abs(foot_rect.top + shift_halfway.y + control_padding - container_padding - _this.measurements.container_rect.top);
                    break;
                case "e":
                    x_shift_additional = Math.abs(foot_rect.right + shift_halfway.x - control_padding + container_padding - _this.measurements.container_rect.right);
                    break;
                case "s":
                    y_shift_additional = Math.abs(foot_rect.bottom + shift_halfway.y - control_padding + container_padding - _this.measurements.container_rect.bottom);
                    break;
                case "w":
                    x_shift_additional = -Math.abs(foot_rect.left + shift_halfway.x + control_padding - container_padding - _this.measurements.container_rect.left);
                    break;
                case "nne":
                    y_shift_additional = -Math.abs(foot_rect.top + shift_halfway.y + control_padding - container_padding - _this.measurements.container_rect.top);
                    x_shift_additional = Math.abs(y_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;
                case "sse":
                    y_shift_additional = Math.abs(foot_rect.bottom + shift_halfway.y - control_padding + container_padding - _this.measurements.container_rect.bottom);
                    x_shift_additional = Math.abs(y_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "ssw":
                    y_shift_additional = Math.abs(foot_rect.bottom + shift_halfway.y - control_padding + container_padding - _this.measurements.container_rect.bottom);
                    x_shift_additional = -Math.abs(y_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "nnw":
                    y_shift_additional = -Math.abs(foot_rect.top + shift_halfway.y + control_padding - container_padding - _this.measurements.container_rect.top);
                    x_shift_additional = -Math.abs(y_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;
                case "ne":
                    x_shift_additional = Math.abs(foot_rect.right + shift_halfway.x - control_padding + container_padding - _this.measurements.container_rect.right);
                    y_shift_additional = -Math.abs(x_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "se":
                    x_shift_additional = Math.abs(foot_rect.right + shift_halfway.x - control_padding + container_padding - _this.measurements.container_rect.right);
                    y_shift_additional = Math.abs(x_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "sw":
                    x_shift_additional = -Math.abs(foot_rect.left + shift_halfway.x + control_padding - container_padding - _this.measurements.container_rect.left);
                    y_shift_additional = Math.abs(x_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;
                case "nw":
                    x_shift_additional = -Math.abs(foot_rect.left + shift_halfway.x + control_padding - container_padding - _this.measurements.container_rect.left);
                    y_shift_additional = -Math.abs(x_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;

            }

            const keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" },
                { transform: `translate(${translate_xy.tX + x_shift / 2 + x_shift_additional}px,${translate_xy.tY + y_shift / 2 + y_shift_additional}px) scale(1.5)`, filter: `blur(${_module.ui_attributes.cell_dimensions * 0.002}rem) drop-shadow(${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 20}px rgba(0, 0, 0, 0.05))` }, // Halfway
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px) scale(1)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" } // Back to original position
            ];

            const duration_additional = !x_shift_additional && !y_shift_additional ? 1 : (Math.abs(x_shift_additional + y_shift_additional) / foot_rect.width) * _module.cfg.animation.jump_duration * 0.3;
            const duration = _module.cfg.animation.jump_duration * 1.5 + duration_additional;

            _module.utils.animate(foot, keyframes, { duration }, callback);
            _module.sound.play("block_collide_boundary", duration * 0.5);
        };

        function jumpBlock(foot, x_shift, y_shift, callback) {
            _module.game_state.ignore_user_input = true;

            _module.utils.fadeOut("#pivotor");

            const translate_xy = _module.utils.getTranslateXY(foot);

            let keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }, // Initial
                { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: `blur(${_module.ui_attributes.cell_dimensions / 500}rem) drop-shadow(${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 20}px rgba(0, 0, 0, 0.05))` }, // Halfway between initial and block
                { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }, // Block position
            ];

            _module.utils.animate(foot, keyframes, { duration: _module.cfg.animation.jump_duration }, () => {
                setTimeout(() => {

                    let keyframes = [
                        { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }, // Block position
                        { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: `blur(${_module.ui_attributes.cell_dimensions / 500}rem) drop-shadow(${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 20}px rgba(0, 0, 0, 0.05))` }, // Halfway between initial and block
                        { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }, // Initial

                    ];

                    _module.utils.animate(foot, keyframes, {
                        duration: _module.cfg.animation.jump_duration,
                        delay: 10
                    }, () => {
                        if (typeof (callback) == "function") {
                            callback();
                        }
                    });
                }, 80);
            });
            _module.sound.play("block_collide_jump", _module.cfg.animation.jump_duration);
        }

        function jumpVortex(foot, x_shift, y_shift, callback) {
            _module.game_state.ignore_user_input = true;

            _module.utils.fadeOut("#pivotor");

            const translate_xy = _module.utils.getTranslateXY(foot);

            let keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }, // Initial
                { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: `blur(${_module.ui_attributes.cell_dimensions * 0.002}rem) drop-shadow(${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 6}px ${_module.ui_attributes.cell_dimensions / 20}px rgba(0, 0, 0, 0.05))` }, // Halfway between initial and block
                { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0) drop-shadow(0 0 0 rgba(0, 0, 0, 0.15))" }, // Block position
            ];

            _module.utils.animate(foot, keyframes, { duration: _module.cfg.animation.jump_duration }, () => {
                if (typeof (callback) == "function") {
                    callback();
                }
            });
        }

        // Store coords of elements before any elements are moved
        const foot_rect = foot.getBoundingClientRect();
        orig_pos_x = foot_rect.x;
        orig_pos_y = foot_rect.y;

        const foot_id = foot.getAttribute("id"); // ID of swiped foot
        const angles = []; // Angles between swiped foot and other two feet
        const other_foot_coords = []; // Coords of other two feet
        let x_shift = 0;
        let y_shift = 0;
        let swipe_diagonally = false;
        let swipe_angle;

        // Get angle between swiped foot and other two feet
        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            if (el.getAttribute("id") !== foot_id) {
                angles.push(_module.utils.getAngleEl(foot, el));
                other_foot_coords.push(_module.utils.getCenterPoint(el));
            }
        });

        // Compare the two angles
        angles.forEach(item => {
            let angle = parseFloat(item);
            if (angle === 0 || angle === 90 || angle === 180 || angle === -90) swipe_diagonally = true;
        });

        // Which direction to swipe in
        if (swipe_diagonally) {

            const angle_swiped_and_A = parseInt(_module.utils.getAngleEl(foot, _this.getAFoot())); // Angle between swiped foot and foot at position A

            if (angle_swiped_and_A === -116) { // NW
                x_shift = -cell_len * 3;
                y_shift = -cell_len * 2;
                swipe_angle = 'nw';
            } else if (angle_swiped_and_A === -153) { // NNW
                x_shift = -cell_len * 2;
                y_shift = -cell_len * 3;
                swipe_angle = 'nnw';
            } else if (angle_swiped_and_A === -63) { // NE
                x_shift = cell_len * 3;
                y_shift = -cell_len * 2;
                swipe_angle = 'ne';
            } else if (angle_swiped_and_A === -26) { // NNE
                x_shift = cell_len * 2;
                y_shift = -cell_len * 3;
                swipe_angle = 'nne';
            } else if (angle_swiped_and_A === 116) { // SW
                x_shift = -cell_len * 3;
                y_shift = cell_len * 2;
                swipe_angle = 'sw';
            } else if (angle_swiped_and_A === 153) { // SSW
                x_shift = -cell_len * 2;
                y_shift = cell_len * 3;
                swipe_angle = 'ssw';
            } else if (angle_swiped_and_A === 63) { // SE
                x_shift = cell_len * 3;
                y_shift = cell_len * 2;
                swipe_angle = 'se';
            } else if (angle_swiped_and_A === 26) { // SSE
                x_shift = cell_len * 2;
                y_shift = cell_len * 3;
                swipe_angle = 'sse';
            }

        } else if (!swipe_diagonally) {
            let axis_to_check; // When swiping horizontally or vertically

            // Check whether two other feet are aligned horizontally or vertically
            if (other_foot_coords[0].y === other_foot_coords[1].y) axis_to_check = 'y';
            else if (other_foot_coords[0].x === other_foot_coords[1].x) axis_to_check = 'x';

            const foot_coords = _module.utils.getCenterPoint(foot); // Coords of swiped foot

            if (axis_to_check === 'x') {
                if (other_foot_coords[0].x < foot_coords.x) { // West
                    x_shift = -cell_len * 4;
                    swipe_angle = 'w';
                } else { // East
                    x_shift = cell_len * 4;
                    swipe_angle = 'e';
                }
            } else if (axis_to_check === 'y') {
                if (other_foot_coords[0].y < foot_coords.y) { // North
                    y_shift = -cell_len * 4;
                    swipe_angle = 'n';
                } else { // South
                    y_shift = cell_len * 4;
                    swipe_angle = 's';
                }
            }
        }

        foot.style.zIndex = 2000; // Bring foot to top

        // Check whether boundary has been intersected

        const boundary_check = boundaryIntersected(x_shift, y_shift);

        const foot_center_point = _module.utils.getCenterPoint(foot);
        const move_to_x = foot_center_point.x + x_shift;
        const move_to_y = foot_center_point.y + y_shift;
        block_collide = collided(move_to_x, move_to_y);
        vortex_collide = collided(move_to_x, move_to_y, _module.game_state.vortex_center_coords);

        function postJumpFail() {
            showNextPivotIndicators();
            foot.style.zIndex = 1000;
            _module.utils.fadeIn("#pivotor");
            _module.game_state.ignore_user_input = false;
        }

        if (boundary_check) { // Foot swiped off the board
            hideNextPivotIndicators();
            jumpBoundary(foot, x_shift, y_shift, swipe_angle, postJumpFail);
        } else if (block_collide) { // Foot collided with a block
            hideNextPivotIndicators();
            jumpBlock(foot, x_shift, y_shift, postJumpFail);
        } else if (vortex_collide) { // Foot collided with a vortex
            clearNextPivotIndicators();
            jumpVortex(foot, x_shift, y_shift, () => {
                _module.sound.play("land");
                _module.utils.fadeOutAndDisable(".info-panel .hame");
                _module.utils.fadeOut("#sound", 100);
                _module.utils.fadeOut("#guides", 100);
                _module.utils.fadeOut("#pivotor");
                _module.game_state.level_end = true;
                animateVortex({
                    foot_id: foot.getAttribute("id"), // ID of foot that has collided with vortex
                    x: move_to_x,
                    y: move_to_y
                }, () => {
                    _module.level_builder.showLoseScreen(_module.cfg.svg_elements.vortex.lose_message);
                });
            });
        } else { // OK to jump
            clearNextPivotIndicators();
            clearTimeout(pivot_timeout);
            jump(foot, x_shift, y_shift, () => {
                foot.style.zIndex = 1000;
                _this.calculatePivotState();
                _this.repositionPivot(true);
                moveSuccess();
                clearTimeout(pivot_timeout);
                _module.sound.play("land");
                _module.game_state.ignore_user_input = false;
            });
        }
    }

    return _this;

}(TRIPODS || {}));

// Before refactor: https://github.com/donbrae/tripods-web/blob/5521e55afc7269226db453759c4b6242813f03e6/js/game/mvt.js

TRIPODS.mvt = (function (mod) {

    "use strict";

    const submod = {
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

    let count_foot1;
    let count_foot2;
    let count_foot3;

    let pivot_timeout = undefined; // Don't show pivot during quick succession of jumps

    // Foot hits one of the four walls
    function boundaryIntersected(x_shift, y_shift, cell_len) {
        const control_padding = TRIPODS.ui_attributes.control_padding;
        const container_padding = parseFloat(document.getElementById("container").style.padding);

        if (orig_pos_x + control_padding + x_shift - container_padding < submod.measurements.container_rect.x) return "left"; // Hits left container boundary (x_shift will be a minus value)
        else if (orig_pos_x + control_padding + x_shift + container_padding + cell_len > submod.measurements.container_rect.right) return "right";
        else if (orig_pos_y + control_padding + y_shift - container_padding < submod.measurements.container_rect.y) return "top";
        else if (orig_pos_y + control_padding + y_shift + container_padding + cell_len > submod.measurements.container_rect.bottom) return "bottom";

        return false;
    };

    function blockCollision(cx, cy) {
        const block_center_coords = TRIPODS.game_state.block_center_coords;
        let collide = false;

        for (let i = 0; i < block_center_coords.length; i++) {
            const block = block_center_coords[i];
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

        TRIPODS.game_state.updateMoveCounter();
        TRIPODS.game_state.checkWin();

        if (TRIPODS.game_state.tutorial_running && TRIPODS.tutorials.checkFollow())
            setTimeout(() => { // Delay to allow pivot to reposition
                TRIPODS.tutorials.placeTutorialElement();
            }, 300);
        else if (TRIPODS.game_state.tutorial_running)
            TRIPODS.tutorials.finish();
    }

    submod.getMeasurements = function () {
        if (!isNaN(TRIPODS.game_state.level)) {

            // Get blocker coords (centre points)
            TRIPODS.game_state.block_center_coords.length = 0;
            Array.prototype.forEach.call(document.getElementsByClassName("block"), block => {
                TRIPODS.game_state.block_center_coords.push(TRIPODS.utils.getCenterPoint(block));
            });

            this.measurements.container_rect = document.getElementById("container").getBoundingClientRect();
            this.measurements.cells_in_row = TRIPODS.levels[TRIPODS.game_state.level][1].length;
            this.measurements.cells_in_column = TRIPODS.levels[TRIPODS.game_state.level].length - 1;
        }
    }

    // Works out where each foot should be in the foot_pivot_sequence
    submod.calculatePivotState = function () {
        const a_foot = submod.getAFoot();
        const foot_id = a_foot.getAttribute('id');
        const a_foot_ctr_pt = TRIPODS.utils.getCenterPoint(a_foot);
        const other_feet = [];
        const foot1_ctr = TRIPODS.utils.getCenterPoint(document.getElementById("foot1"));
        const foot2_ctr = TRIPODS.utils.getCenterPoint(document.getElementById("foot2"));
        const foot3_ctr = TRIPODS.utils.getCenterPoint(document.getElementById("foot3"));

        Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) {
            if (el.getAttribute('id') !== a_foot.getAttribute('id')) {
                other_feet.push(TRIPODS.utils.getCenterPoint(el));
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
    submod.getAFoot = function () {

        let foot;

        function compareToOtherFeet(foot) {

            const angles = [];
            let is_foot_a = true; // Flag. Where 'a' is 'top' point of isosceles triangle

            Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) { // For each of the other two feet
                if (el.getAttribute("id") !== foot.getAttribute("id"))
                    angles.push(TRIPODS.utils.getAngleEl(foot, el));
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

    submod.repositionPivot = function (fade_in, delay = 300) {

        const pivot = document.getElementById("pivitor");
        const pivot_rect = pivot.getBoundingClientRect();

        const foot1 = document.getElementById("foot1");
        const foot2 = document.getElementById("foot2");
        const foot3 = document.getElementById("foot3");

        const angle_1_2 = Math.round(TRIPODS.utils.getAngleEl(foot1, foot2));
        const angle_1_3 = Math.round(TRIPODS.utils.getAngleEl(foot1, foot3));

        let pivot_shift_x;
        let pivot_shift_y;

        const side = mod.ui_attributes.svg_xy;
        const shunt = Math.round(mod.ui_attributes.svg_xy / 6);

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

        const translate_xy = TRIPODS.utils.getTranslateXY(pivot);

        const keyframes = [
            { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial (0,0) or current x_shift and y_shift for the pivotor
            { transform: `translate(${translate_xy.tX + pivot_shift_x}px,${translate_xy.tY + pivot_shift_y}px)` }
        ];

        const cb = fade_in ? () => {
            if (pivot_timeout !== undefined) {
                clearTimeout(pivot_timeout);
                pivot_timeout = undefined;
            }

            pivot_timeout = setTimeout(() => {
                TRIPODS.utils.fadeIn("#pivitor");
            }, delay);
        } : null;

        TRIPODS.utils.animate(pivot, keyframes, {
            duration: mod.cfg.animation.jump_duration
        }, cb);
    }

    // Pivot

    submod.pivot = function (e) {

        if (TRIPODS.game_state.ignore_user_input || TRIPODS.game_state.level_win) {
            return false;
        }

        TRIPODS.game_state.element_tapped = `#${e.currentTarget.id}`;

        if (TRIPODS.game_state.tutorial_running)
            TRIPODS.utils.fadeOut("#tap"); // Hide tutorial label

        let pivot_foot_count = 0;
        const foot_move_data = [];
        let block_collide_via_pivot = false;

        function postPivot(foot, count) {
            updatePivotCounter(foot, count);
            pivot_foot_count++;
        };

        function finishPivot(foot_move) {
            if (foot_move.move) {

                const foot = document.getElementById(foot_move.foot);
                const translate_xy = TRIPODS.utils.getTranslateXY(foot);

                const keyframes = [
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x}px,${translate_xy.tY + foot_move.shift.y}px) `, filter: `blur(${TRIPODS.ui_attributes.svg_xy * 0.001}rem)` }, // Destination
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x * 1.06}px,${translate_xy.tY + foot_move.shift.y * 1.06}px)` }, // Overswing
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x}px,${translate_xy.tY + foot_move.shift.y}px)`, filter: "blur(0)" }, // Destination
                ];

                TRIPODS.utils.animate(foot, keyframes, { duration: 250 }, () => { postPivot(foot_move.foot, foot_move.count); });

            } else postPivot(foot_move.foot, foot_move.count);
        };

        function abortPivot(foot_move) {

            if (foot_move.move) {

                const foot = document.getElementById(foot_move.foot);
                const translate_xy = TRIPODS.utils.getTranslateXY(foot);

                const keyframes = [
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                    { transform: `translate(${translate_xy.tX + foot_move.shift.x / 4}px,${translate_xy.tY + foot_move.shift.y / 4}px)`, filter: `blur(${TRIPODS.ui_attributes.svg_xy * 0.001}rem)` }, // Hit block
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                    { transform: `translate(${translate_xy.tX - foot_move.shift.x / 8}px,${translate_xy.tY - foot_move.shift.y / 8}px)` }, // Overswing
                    { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0)" } // Initial
                ];

                TRIPODS.utils.animate(foot, keyframes, { duration: 200 }, () => {
                    pivot_foot_count++;
                });

            } else {
                pivot_foot_count++;
            }
        };

        function startPivot(callback) {
            TRIPODS.game_state.ignore_user_input = true;

            foot_move_data.forEach(item => {
                // Amend count
                if (item.count === 11) item.count = 0;
                else item.count++;

                if (typeof (callback) == "function") callback(item);
            });
        };

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
                    if (foot_pivot_sequence[count][1] === "-") foot_shift_x = - TRIPODS.ui_attributes.svg_xy;
                    else if (foot_pivot_sequence[count][1] === "+") foot_shift_x = TRIPODS.ui_attributes.svg_xy;

                    shift = { x: foot_shift_x, y: 0 }; // Store parameters for animation

                } else if (foot_pivot_sequence[count][0] === "top") {

                    let foot_shift_y;

                    if (foot_pivot_sequence[count][1] === "-") foot_shift_y = - TRIPODS.ui_attributes.svg_xy;
                    else if (foot_pivot_sequence[count][1] === "+") foot_shift_y = TRIPODS.ui_attributes.svg_xy;

                    shift = { x: 0, y: foot_shift_y };
                }

                foot_move_data.push({
                    foot: foot, // Element ID
                    move: true,
                    count: count,
                    shift: shift // x,y
                });

                const foot_center_point = TRIPODS.utils.getCenterPoint(document.getElementById(foot));
                block_collide = blockCollision(foot_center_point.x + shift.x, foot_center_point.y + shift.y);

                if (block_collide) block_collide_via_pivot = true;

            } else if (foot_pivot_sequence[count] === null) { // If foot isn't to move this time
                foot_move_data.push({
                    foot: foot, // Element ID
                    move: false,
                    count: count
                });
            }
        };

        if (TRIPODS.game_state.ignore_user_input) return false;

        const pivot_check = setInterval(function () { // Check for completion of pivot

            if (pivot_foot_count === 3 && !block_collide_via_pivot) {
                submod.repositionPivot();
                TRIPODS.game_state.ignore_user_input = false;
                clearInterval(pivot_check);
                moveSuccess();

            } else if (pivot_foot_count === 3 && block_collide_via_pivot) {
                TRIPODS.game_state.ignore_user_input = false;
                clearInterval(pivot_check);
            }
        }, 50);

        // Which feet should moseve?
        checkWhichFeetShouldPivot("foot1", count_foot1);
        checkWhichFeetShouldPivot("foot2", count_foot2);
        checkWhichFeetShouldPivot("foot3", count_foot3);

        if (!block_collide_via_pivot)
            startPivot(finishPivot); // If no block go pivot
        else if (block_collide_via_pivot)
            startPivot(abortPivot); // Don't pivot
    }

    // Swipe

    submod.swipe = function (e) {

        // e.gesture.preventDefault();

        if (TRIPODS.game_state.ignore_user_input || TRIPODS.game_state.level_win) {
            return false;
        }

        TRIPODS.game_state.element_tapped = `#${e.currentTarget.id}`;

        if (TRIPODS.game_state.tutorial_running)
            TRIPODS.utils.fadeOut("#tap"); // Hide tutorial label

        const cell_len = TRIPODS.ui_attributes.svg_xy;
        const foot = document.getElementById(e.currentTarget.id);

        // Move the swiped foot (left and top arguments are the destination coords)
        function jump(foot, x_shift, y_shift, callback) {
            TRIPODS.game_state.ignore_user_input = true;

            const translate_xy = TRIPODS.utils.getTranslateXY(foot);

            const keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(1px)" },
                { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: "blur(3px)" }, // Halfway
                { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0)" }
            ];

            TRIPODS.utils.animate(foot, keyframes, { duration: mod.cfg.animation.jump_duration }, callback);
        };

        function jumpBoundary(foot, x_shift, y_shift, swipe_angle, callback) {
            TRIPODS.game_state.ignore_user_input = true;

            const translate_xy = TRIPODS.utils.getTranslateXY(foot);
            let x_shift_additional = 0;
            let y_shift_additional = 0;

            const control_padding = TRIPODS.ui_attributes.control_padding;
            const container_padding = parseFloat(document.getElementById("container").style.padding);
            const foot_rect = foot.getBoundingClientRect();

            const shift_halfway = { // Halfway point of a full jump
                x: x_shift / 2,
                y: y_shift / 2
            }

            switch (swipe_angle) {
                case "n":
                    y_shift_additional = -Math.abs(foot_rect.top + shift_halfway.y + control_padding - container_padding - submod.measurements.container_rect.top);
                    break;
                case "e":
                    x_shift_additional = Math.abs(foot_rect.right + shift_halfway.x - control_padding + container_padding - submod.measurements.container_rect.right);
                    break;
                case "s":
                    y_shift_additional = Math.abs(foot_rect.bottom + shift_halfway.y - control_padding + container_padding - submod.measurements.container_rect.bottom);
                    break;
                case "w":
                    x_shift_additional = -Math.abs(foot_rect.left + shift_halfway.x + control_padding - container_padding - submod.measurements.container_rect.left);
                    break;
                case "nne":
                    y_shift_additional = -Math.abs(foot_rect.top + shift_halfway.y + control_padding - container_padding - submod.measurements.container_rect.top);
                    x_shift_additional = Math.abs(y_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;
                case "sse":
                    y_shift_additional = Math.abs(foot_rect.bottom + shift_halfway.y - control_padding + container_padding - submod.measurements.container_rect.bottom);
                    x_shift_additional = Math.abs(y_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "ssw":
                    y_shift_additional = Math.abs(foot_rect.bottom + shift_halfway.y - control_padding + container_padding - submod.measurements.container_rect.bottom);
                    x_shift_additional = -Math.abs(y_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "nnw":
                    y_shift_additional = -Math.abs(foot_rect.top + shift_halfway.y + control_padding - container_padding - submod.measurements.container_rect.top);
                    x_shift_additional = -Math.abs(y_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;
                case "ne":
                    x_shift_additional = Math.abs(foot_rect.right + shift_halfway.x - control_padding + container_padding - submod.measurements.container_rect.right);
                    y_shift_additional = -Math.abs(x_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "se":
                    x_shift_additional = Math.abs(foot_rect.right + shift_halfway.x - control_padding + container_padding - submod.measurements.container_rect.right);
                    y_shift_additional = Math.abs(x_shift_additional - cell_len * 0.84); // > Replace with proper maths
                    break;
                case "sw":
                    x_shift_additional = -Math.abs(foot_rect.left + shift_halfway.x + control_padding - container_padding - submod.measurements.container_rect.left);
                    y_shift_additional = Math.abs(x_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;
                case "nw":
                    x_shift_additional = -Math.abs(foot_rect.left + shift_halfway.x + control_padding - container_padding - submod.measurements.container_rect.left);
                    y_shift_additional = -Math.abs(x_shift_additional + cell_len * 0.84); // > Replace with proper maths
                    break;

            }

            const keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)`, filter: "blur(0px)" },
                { transform: `translate(${translate_xy.tX + x_shift / 2 + x_shift_additional}px,${translate_xy.tY + y_shift / 2 + y_shift_additional}px) scale(1.5)`, filter: "blur(2px)" }, // Halfway
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px) scale(1)`, filter: "blur(0)" } // Back to original position
            ];

            TRIPODS.utils.animate(foot, keyframes, { duration: mod.cfg.animation.jump_duration * 1.75 }, callback)
        };

        function jumpBlock(foot, x_shift, y_shift, callback) {
            TRIPODS.game_state.ignore_user_input = true;

            TRIPODS.utils.fadeOut("#pivitor");

            const translate_xy = TRIPODS.utils.getTranslateXY(foot);

            let keyframes = [
                { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial
                { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: `blur(${TRIPODS.ui_attributes.svg_xy * 0.002}rem)` }, // Halfway between initial and block
                { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0)" }, // Block position
            ];

            TRIPODS.utils.animate(foot, keyframes, { duration: mod.cfg.animation.jump_duration }, () => {
                setTimeout(() => {

                    let keyframes = [
                        { transform: `translate(${translate_xy.tX + x_shift}px,${translate_xy.tY + y_shift}px) scale(1)`, filter: "blur(0)" }, // Block position
                        { transform: `translate(${translate_xy.tX + x_shift / 2}px,${translate_xy.tY + y_shift / 2}px) scale(1.8)`, filter: `blur(${TRIPODS.ui_attributes.svg_xy * 0.002}rem)` }, // Halfway between initial and block
                        { transform: `translate(${translate_xy.tX}px,${translate_xy.tY}px)` }, // Initial

                    ];

                    TRIPODS.utils.animate(foot, keyframes, {
                        duration: mod.cfg.animation.jump_duration,
                        delay: 10
                    }, () => {
                        TRIPODS.utils.fadeIn("#pivitor");
                        callback();
                    });
                }, 80);
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
                angles.push(TRIPODS.utils.getAngleEl(foot, el));
                other_foot_coords.push(TRIPODS.utils.getCenterPoint(el));
            }
        });

        // Compare the two angles
        angles.forEach(item => {
            let angle = parseFloat(item);
            if (angle === 0 || angle === 90 || angle === 180 || angle === -90) swipe_diagonally = true;
        });

        // Which direction to swipe in
        if (swipe_diagonally) {

            const angle_swiped_and_A = parseInt(TRIPODS.utils.getAngleEl(foot, submod.getAFoot())); // Angle between swiped foot and foot at position A

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

            const foot_coords = TRIPODS.utils.getCenterPoint(foot); // Coords of swiped foot

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

        const boundary_check = boundaryIntersected(x_shift, y_shift, cell_len);

        const foot_center_point = TRIPODS.utils.getCenterPoint(foot);
        block_collide = blockCollision(foot_center_point.x + x_shift, foot_center_point.y + y_shift);

        if (boundary_check) { // If swiped off the board
            jumpBoundary(foot, x_shift, y_shift, swipe_angle, () => {
                foot.style.zIndex = 1000; // Reset z-index
                TRIPODS.game_state.ignore_user_input = false;
            });
        } else if (block_collide) {
            jumpBlock(foot, x_shift, y_shift, () => {
                foot.style.zIndex = 1000;
                TRIPODS.game_state.ignore_user_input = false;
            });
        } else {
            jump(foot, x_shift, y_shift, () => {
                foot.style.zIndex = 1000;
                submod.calculatePivotState();
                submod.repositionPivot(true);
                moveSuccess();
                TRIPODS.game_state.ignore_user_input = false;
            });

            if (pivot_timeout !== undefined) {
                clearTimeout(pivot_timeout);
                pivot_timeout = undefined;
            }

            TRIPODS.utils.fadeOut("#pivitor");
        }
    }

    return submod;

}(TRIPODS || {}));

// Before refactor: https://github.com/donbrae/tripods-web/blob/5521e55afc7269226db453759c4b6242813f03e6/js/game/mvt.js

TRIPODS.mvt = (function (mod) {

    "use strict";

    const submod = {
        measurements: {
            container_offset_l: '',
            container_offset_t: '',
            container_width: '',
            container_height: '',
            cells_in_row: '',
            cells_in_column: ''
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

    let count_foot1, count_foot2, count_foot3;

    // Foot hits one of the four walls
    function boundaryIntersected(left, top, cell_len) {
        const control_padding = TRIPODS.ui_attributes.control_padding;

        if (left < -control_padding) return 'left'; // Hits left container boundary
        else if (left > cell_len * (submod.measurements.cells_in_row - 1) - control_padding) return 'right';
        else if (top < -control_padding) return 'top';
        else if (top > cell_len * (submod.measurements.cells_in_column - 1) - control_padding) return 'bottom';

        return false;
    };

    function elementCollision(left, top) {
        const block_coords = TRIPODS.game_state.block_coords;
        let collide = false;

        for (let i = 0; i < block_coords.length; i++) {
            const item = block_coords[i];
            if (item.left === left && item.top === top) {
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
            TRIPODS.tutorials.placeTutorialElement();
        else if (TRIPODS.game_state.tutorial_running)
            TRIPODS.tutorials.finish();
    }

    submod.getMeasurements = function () {
        if (!isNaN(TRIPODS.game_state.level)) {
            const container_rect = document.getElementById("container").getBoundingClientRect();
            this.measurements.container_offset_l = container_rect.left;
            this.measurements.container_offset_t = container_rect.top;
            this.measurements.container_width = container_rect.width;
            this.measurements.container_height = container_rect.height;
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

    // > Refactor as per LiveCode `on repositionPivot` (LiveCode function getAngleBetweenPoints() = getAngle() here)
    submod.repositionPivot = function () {

        const pivot = document.getElementById("pivitor");

        const foot1 = document.getElementById("foot1");
        const foot2 = document.getElementById("foot2");
        const foot3 = document.getElementById("foot3");

        const angle_1_2 = Math.round(TRIPODS.utils.getAngleEl(foot1, foot2));
        const angle_1_3 = Math.round(TRIPODS.utils.getAngleEl(foot1, foot3));

        let pivot_x; // `left` style attribute of where pivot should be (x)
        let pivot_y; // As above, but for y

        const side = mod.ui_attributes.svg_xy;
        const shunt = Math.round(mod.ui_attributes.svg_xy / 6); // px

        // Clockwise arrangement 1, 2, 3
        if (angle_1_2 === 63 && angle_1_3 === 117) { // Position 1
            pivot_x = foot1.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot1).top) + side + shunt}px`;
        } else if (angle_1_2 === 90 && angle_1_3 === 153) { // Position 2
            pivot_y = foot3.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot3).left) + side + shunt}px`;
        } else if (angle_1_2 === 117 && angle_1_3 === 180) { // Position 3
            pivot_x = foot2.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot2).top) - side - shunt}px`;
        } else if (angle_1_2 === 153 && angle_1_3 === - 153) { // Position 4
            pivot_y = foot1.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot1).left) - side - shunt}px`;
        } else if (angle_1_2 === 180 && angle_1_3 === - 117) { // Position 5
            pivot_x = foot3.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot3).top) + side + shunt}px`;
        } else if (angle_1_2 === - 153 && angle_1_3 === - 90) { // Position 6
            pivot_y = foot2.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot2).left) + side + shunt}px`;
        } else if (angle_1_2 === - 117 && angle_1_3 === - 63) { // Position 7
            pivot_x = foot1.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot1).top) - side - shunt}px`;
        } else if (angle_1_2 === - 90 && angle_1_3 === - 27) { // Position 8
            pivot_y = foot3.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot3).left) - side - shunt}px`;
        } else if (angle_1_2 === - 63 && angle_1_3 === 0) { // Position 9
            pivot_x = foot2.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot2).top) + side + shunt}px`;
        } else if (angle_1_2 === - 27 && angle_1_3 === 27) { // Position 10
            pivot_y = foot1.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot1).left) + side + shunt}px`;
        } else if (angle_1_2 === 0 && angle_1_3 === 63) { // Position 11
            pivot_x = foot3.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot3).top) - side - shunt}px`;
        } else if (angle_1_2 === 27 && angle_1_3 === 90) { // Position 12
            pivot_y = foot2.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot2).left) - side - shunt}px`;
        } else if (angle_1_3 === 63 && angle_1_2 === 117) { // Position 1 (clockwise 1, 3, 2)
            pivot_x = foot1.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot1).top) + side + shunt}px`;
        } else if (angle_1_3 === 90 && angle_1_2 === 153) { // Position 2
            pivot_y = foot2.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot2).left) + side + shunt}px`;
        } else if (angle_1_3 === 117 && angle_1_2 === 180) { // Position 3
            pivot_x = foot3.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot3).top) - side - shunt}px`;
        } else if (angle_1_3 === 153 && angle_1_2 === - 153) { // Position 4
            pivot_y = foot1.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot1).left) - side - shunt}px`;
        } else if (angle_1_3 === 180 && angle_1_2 === - 117) { // Position 5
            pivot_x = foot2.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot2).top) + side + shunt}px`;
        } else if (angle_1_3 === - 153 && angle_1_2 === - 90) { // Position 6
            pivot_y = foot3.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot3).left) + side + shunt}px`;
        } else if (angle_1_3 === - 117 && angle_1_2 === - 63) { // Position 7
            pivot_x = foot1.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot1).top) - side - shunt}px`;
        } else if (angle_1_3 === - 90 && angle_1_2 === - 27) { // Position 8
            pivot_y = foot2.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot2).left) - side - shunt}px`;
        } else if (angle_1_3 === - 63 && angle_1_2 === 0) { // Position 9
            pivot_x = foot3.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot3).top) + side + shunt}px`;
        } else if (angle_1_3 === - 27 && angle_1_2 === 27) { // Position 10
            pivot_y = foot1.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot1).left) + side + shunt}px`;
        } else if (angle_1_3 === 0 && angle_1_2 === 63) { // Position 11
            pivot_x = foot2.style.left;
            pivot_y = `${parseInt(getComputedStyle(foot2).top) - side - shunt}px`;
        } else if (angle_1_3 === 27 && angle_1_2 === 90) { // Position 12
            pivot_y = foot3.style.top;
            pivot_x = `${parseInt(getComputedStyle(foot3).left) - side - shunt}px`;
        } else {
            // > Just a bit of defensive programming for the pivot to stay still if none of the above conditions is met(so pivot_x and pivot_y have a value)
            pivot_x = pivot.style.left;
            pivot_y = pivot.style.top;
        }

        pivot.style.left = pivot_x;
        pivot.style.top = pivot_y;

        setTimeout(function() {
            pivot.style.opacity = 1;
        }, 100);
    }

    // Pivot

    submod.pivot = function (e) {

        if (TRIPODS.game_state.ignore_user_input || TRIPODS.game_state.level_win) {
            return false;
        }

        TRIPODS.game_state.element_tapped = `#${e.currentTarget.id}`;

        if (TRIPODS.game_state.tutorial_running)
            document.getElementById("tap").style.opacity = 0; // Hide tutorial label

        let pivot_foot_count = 0;
        const foot_move_data = [];
        let block_collide_via_pivot = false;

        function postPivot(foot, count) {
            updatePivotCounter(foot, count);
            pivot_foot_count++;
        };

        function finishPivot(obj) {
            if (obj.move) {
                const foot = document.getElementById(obj.foot);

                Object.keys(obj.anim_params).forEach(function (key) {
                    foot.style[key] = `${obj.anim_params[key]}px`;
                });

                setTimeout(function () {
                    postPivot(obj.foot, obj.count);
                }, mod.cfg.animation.pivot.duration);
            } else postPivot(obj.foot, obj.count);
        };

        function abortPivot(obj) {

            if (obj.move) {

                const anim_obj = {};
                const foot = document.getElementById(obj.foot);

                if (obj.anim_params.left === obj.orig_coords.left) // If x positions match between current foot position and where it should pivot to, calculate direction the foot should shoogle
                    anim_obj.top = obj.orig_coords.top + (obj.anim_params.top - obj.orig_coords.top) / 4;
                else if (obj.anim_params.top === obj.orig_coords.top)
                    anim_obj.left = obj.orig_coords.left + (obj.anim_params.left - obj.orig_coords.left) / 4;

                // Move relevant feet slightly
                Object.keys(anim_obj).forEach(function (key) {
                    foot.style[key] = `${anim_obj[key]}px`;
                });

                setTimeout(function () {
                    // Move relevant feet back
                    Object.keys(obj.orig_coords).forEach(function (key) {
                        foot.style[key] = `${obj.orig_coords[key]}px`;
                    });

                    setTimeout(function () {
                        pivot_foot_count++;
                    }, mod.cfg.animation.pivot.duration * 0.83);

                }, mod.cfg.animation.pivot.duration * 0.83);
            } else pivot_foot_count++;
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

            const left = parseFloat(getComputedStyle(document.getElementById(foot))["left"]);
            const top = parseFloat(getComputedStyle(document.getElementById(foot))["top"]);

            if (foot_pivot_sequence[count] !== null) { // If foot should move

                let anim_params; // Where feet will move to if the move is valid (e.g. doesn't encounter blocker UI element)

                if (foot_pivot_sequence[count][0] === 'left') {

                    let foot_new_position_left;

                    // Get new foot coords
                    if (foot_pivot_sequence[count][1] === '-') foot_new_position_left = left - TRIPODS.ui_attributes.svg_xy;
                    else if (foot_pivot_sequence[count][1] === '+') foot_new_position_left = left + TRIPODS.ui_attributes.svg_xy;

                    anim_params = { 'left': foot_new_position_left, top: top }; // Store parameters for animation

                } else if (foot_pivot_sequence[count][0] === 'top') {

                    let foot_new_position_top;

                    if (foot_pivot_sequence[count][1] === '-') foot_new_position_top = top - TRIPODS.ui_attributes.svg_xy;
                    else if (foot_pivot_sequence[count][1] === '+') foot_new_position_top = top + TRIPODS.ui_attributes.svg_xy;

                    anim_params = { 'top': foot_new_position_top, left: left };
                }

                foot_move_data.push({
                    foot: foot, // Element ID
                    move: 1,
                    count: count,
                    anim_params: anim_params,
                    orig_coords: {
                        left: left,
                        top: top
                    }
                });

                block_collide = elementCollision(anim_params.left, anim_params.top);

                if (block_collide) block_collide_via_pivot = true;

            } else if (foot_pivot_sequence[count] === null) { // If foot isn't to move this time
                foot_move_data.push({
                    foot: foot, // Element ID
                    move: 0,
                    count: count
                });
            }
        };

        if (TRIPODS.game_state.ignore_user_input) return false;

        const pivot_check = setInterval(function () { // Check for completion of pivot

            if (pivot_foot_count === 3 && !block_collide_via_pivot) {
                submod.repositionPivot();

                moveSuccess();

                TRIPODS.game_state.ignore_user_input = false;
                clearInterval(pivot_check);

            } else if (pivot_foot_count === 3 && block_collide_via_pivot) {
                setTimeout(function () {
                    TRIPODS.game_state.ignore_user_input = false;
                }, 25); // Slight delay to allow shoogle animation to finish, otherwise collision will not be detected in checkWhichFeetShouldPivot()
                clearInterval(pivot_check);
            }
        }, mod.cfg.animation.pivot.duration);

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
            document.getElementById("tap").style.opacity = 0; // Hide tutorial label

        const cell_len = TRIPODS.ui_attributes.svg_xy;
        const foot = document.getElementById(e.currentTarget.id);

        function animateBoundaryIntersect(left, top) {

            foot.style.left = `${left}px`;
            foot.style.top = `${top}px`;
            foot.classList.add("jump-boundary-intersect");

            setTimeout(function() {
                bounceBack();
            }, mod.cfg.animation.default.duration * 1.67);
        };

        function bounceBack() {

            foot.style.left = `${orig_pos_x}px`;
            foot.style.top = `${orig_pos_y}px`;

            setTimeout(function () {
                foot.classList.remove("jump-boundary-intersect");
                TRIPODS.game_state.ignore_user_input = false;
            }, mod.cfg.animation.default.duration * 1.67);
        };

        function abortSwipe(animation) {
            setTimeout(function () {
                foot.style.left = `${orig_pos_x}px`;
                foot.style.top = `${orig_pos_y}px`;

                setTimeout(function () {
                    TRIPODS.game_state.ignore_user_input = false;
                    foot.classList.remove(animation);
                }, mod.cfg.animation.default.duration * 2.5);
            }, mod.cfg.animation.default.duration * 0.42);
        };

        // Finish swipe movement
        function finishSwipe(animation) {
            foot.style.zIndex = 1000; // Reset z-index
            TRIPODS.game_state.ignore_user_input = false;
            submod.calculatePivotState();
            submod.repositionPivot();
            foot.classList.remove(animation);
            moveSuccess();
        };

        // Move the swiped foot
        function startSwipe(left, top, ms, animation, callback) {
            TRIPODS.game_state.ignore_user_input = true;

            foot.style.left = `${left}px`;
            foot.style.top = `${top}px`;
            foot.classList.add(animation);

            setTimeout(function () {
                if (typeof (callback) == "function") callback(animation); // Call either finishSwipe() or bouncBack()
            }, ms);
        };

        // Store coords of elements before any elements are moved
        orig_pos_x = parseInt(getComputedStyle(foot)["left"]);
        orig_pos_y = parseInt(getComputedStyle(foot)["top"]);

        const foot_id = foot.getAttribute("id"); // ID of swiped foot
        const angles = []; // Angles between swiped foot and other two feet
        const other_foot_coords = []; // Coords of other two feet
        let left = parseFloat(getComputedStyle(document.getElementById(e.currentTarget.id))["left"]);
        let top = parseFloat(getComputedStyle(document.getElementById(e.currentTarget.id))["top"]);
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
                left -= (cell_len * 3);
                top -= (cell_len * 2);
                swipe_angle = 'nw';
            } else if (angle_swiped_and_A === -153) { // NNW
                left -= (cell_len * 2);
                top -= (cell_len * 3);
                swipe_angle = 'nnw';
            } else if (angle_swiped_and_A === -63) { // NE
                left += (cell_len * 3);
                top -= (cell_len * 2);
                swipe_angle = 'ne';
            } else if (angle_swiped_and_A === -26) { // NNE
                left += (cell_len * 2);
                top -= (cell_len * 3);
                swipe_angle = 'nne';
            } else if (angle_swiped_and_A === 116) { // SW
                left -= (cell_len * 3);
                top += (cell_len * 2);
                swipe_angle = 'sw';
            } else if (angle_swiped_and_A === 153) { // SSW
                left -= (cell_len * 2);
                top += (cell_len * 3);
                swipe_angle = 'ssw';
            } else if (angle_swiped_and_A === 63) { // SE
                left += (cell_len * 3);
                top += (cell_len * 2);
                swipe_angle = 'se';
            } else if (angle_swiped_and_A === 26) { // SSE
                left += (cell_len * 2);
                top += (cell_len * 3);
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
                    left -= (cell_len * 4);
                    top = top;
                    swipe_angle = 'w';
                } else { // East
                    left += (cell_len * 4);
                    top = top;
                    swipe_angle = 'e';
                }
            } else if (axis_to_check === 'y') {
                if (other_foot_coords[0].y < foot_coords.y) { // North
                    left = left;
                    top -= (cell_len * 4);
                    swipe_angle = 'n';
                } else { // South
                    left = left;
                    top += (cell_len * 4);
                    swipe_angle = 's';
                }
            }
        }

        // Check whether boundary has been intersected

        const boundary_check = boundaryIntersected(left, top, cell_len);
        block_collide = elementCollision(left, top);

        if (boundary_check) { // If swiped off the board

            TRIPODS.game_state.ignore_user_input = true;

            const a_foot = submod.getAFoot(); // Foot at position A
            const a_foot_left = parseFloat(getComputedStyle(a_foot)["left"]);
            const a_foot_top = parseFloat(getComputedStyle(a_foot)["top"]);
            const control_padding = TRIPODS.ui_attributes.control_padding;

            // Animate depending on which wall was hit and at which angle
            if (boundary_check === 'bottom' && swipe_angle === 's') {
                animateBoundaryIntersect(orig_pos_x, cell_len * (submod.measurements.cells_in_column - 1) - control_padding);
            } else if (boundary_check === 'bottom' && swipe_angle === 'ssw') {
                animateBoundaryIntersect(a_foot_left + cell_len / 1.5, cell_len * (submod.measurements.cells_in_column - 1) - control_padding);
            } else if (boundary_check === 'bottom' && swipe_angle === 'sse') {
                animateBoundaryIntersect(a_foot_left - cell_len / 1.5, cell_len * (submod.measurements.cells_in_column - 1) - control_padding);
            } else if (boundary_check === 'top' && swipe_angle === 'n') {
                animateBoundaryIntersect(orig_pos_x, -control_padding);
            } else if (boundary_check === 'top' && swipe_angle === 'nne') {
                animateBoundaryIntersect(a_foot_left - cell_len / 1.5, -control_padding);
            } else if (boundary_check === 'top' && swipe_angle === 'nnw') {
                animateBoundaryIntersect(a_foot_left + cell_len / 1.5, -control_padding);
            } else if (boundary_check === 'left' && swipe_angle === 'w') {
                animateBoundaryIntersect(-control_padding, orig_pos_y);
            } else if (boundary_check === 'left' && swipe_angle === 'sw') {
                animateBoundaryIntersect(a_foot_left - cell_len, a_foot_top - cell_len * 0.7);
            } else if (boundary_check === 'left' && swipe_angle === 'nw') {
                animateBoundaryIntersect(a_foot_left - cell_len, a_foot_top + cell_len * 0.8);
            } else if (boundary_check === 'right' && swipe_angle === 'e') {
                animateBoundaryIntersect(cell_len * (submod.measurements.cells_in_row - 1) - control_padding, orig_pos_y);
            } else if (boundary_check === 'right' && swipe_angle === 'se') {
                animateBoundaryIntersect(a_foot_left + cell_len, a_foot_top - cell_len * 0.7);
            } else if (boundary_check === 'right' && swipe_angle === 'ne') {
                animateBoundaryIntersect(a_foot_left + cell_len, a_foot_top + cell_len * 0.8);
            }

            return false;
        }

        foot.style.zIndex = 2000; // Bring foot to top

        if (block_collide) {
            startSwipe(left, top, mod.cfg.animation.default.duration * 1.25, "jump-block-collide", abortSwipe);
        } else {
            startSwipe(left, top, mod.cfg.animation.default.duration * 2.5, "jump", finishSwipe);
            document.getElementById("pivitor").style.opacity = 0;
        }
    }

    return submod;

}(TRIPODS || {}));

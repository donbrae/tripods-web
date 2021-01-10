// Before refactor: https://github.com/donbrae/tripods-web/blob/5521e55afc7269226db453759c4b6242813f03e6/js/game/mvt.js

TRIPODS.mvt = (function (mod) {

    // Private objects

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

    const control_padding = TRIPODS.ui_attributes.control_padding;
    const cell_len = TRIPODS.ui_attributes.el_side;

    // Foot hits one of the four walls
    function boundaryIntersected(left, top) {
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

    // Public obj

    let submod = {
        measurements: {
            container_offset_l: '',
            container_offset_t: '',
            container_width: '',
            container_height: '',
            cells_in_row: '',
            cells_in_column: ''
        }
    };

    let count_foot1, count_foot2, count_foot3;

    submod.getMeasurements = function () {
        const container_rect = document.getElementById("container").getBoundingClientRect();
        this.measurements.container_offset_l = container_rect.left;
        this.measurements.container_offset_t = container_rect.top;
        this.measurements.container_width = container_rect.width;
        this.measurements.container_height = container_rect.height;
        this.measurements.cells_in_row = TRIPODS.levels[TRIPODS.game_state.level][0][0].length;
        this.measurements.cells_in_column = TRIPODS.levels[TRIPODS.game_state.level][0].length;
    }

    // Works out where each foot should be in the foot_pivot_sequence
    submod.calculatePivotState = function () {
        var a_foot = submod.getAFoot(),
            foot_id = a_foot.getAttribute('id'),
            a_foot_ctr_pt = TRIPODS.utils.getCenterPoint(a_foot),
            other_feet = [],
            foot1_ctr = TRIPODS.utils.getCenterPoint(document.getElementById("foot1")),
            foot2_ctr = TRIPODS.utils.getCenterPoint(document.getElementById("foot2")),
            foot3_ctr = TRIPODS.utils.getCenterPoint(document.getElementById("foot3"));

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

        var foot,

            compareToOtherFeet = function (foot) {

                var angles = [],
                    a_found; // Flag. Where 'a' is 'top' point of isosceles triangle

                Array.prototype.forEach.call(document.getElementsByClassName("foot"), function (el) { // For each of the other two feet
                    if (el.getAttribute("id") !== foot.getAttribute("id"))
                        angles.push(TRIPODS.utils.getAngleEl(foot, el));
                });

                a_found = 1;

                // Compare the two angles
                angles.forEach(el => {
                    let angle = parseFloat(el);

                    if (angle === 0 || angle === 90 || angle === 180 || angle === -90) {
                        a_found = 0;
                        return false;
                    }
                });

                if (a_found) {
                    // a_foot = foot; // Set A-point foot // > Why is this being set as a global variable?
                    return true;
                } else {
                    return false;
                }
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

    // Reposition pivot control after pivot
    submod.repositionPivot = function () {

        const pivot = document.getElementsByClassName("pivitor")[0];

        function shuntPivot(left, top) {
            pivot.style.left = `${left}px`;
            pivot.style.top = `${top}px`;
        };

        const a_foot = submod.getAFoot(); // Get foot at 'A' point of triangle
        const foot_pivot_angle = parseInt(TRIPODS.utils.getAngleEl(a_foot, pivot)); // Get angle between it and pivitor

        const a_foot_l = parseFloat(getComputedStyle(a_foot)["left"]);
        const a_foot_t = parseFloat(getComputedStyle(a_foot)["top"]);

        // Move pivitor depending on angle
        if (foot_pivot_angle === 0 || foot_pivot_angle === 7) shuntPivot(a_foot_l + 43, a_foot_t);
        else if (foot_pivot_angle === -82) shuntPivot(a_foot_l, a_foot_t - 43);
        else if (foot_pivot_angle === -172) shuntPivot(a_foot_l - 43, a_foot_t);
        else if (foot_pivot_angle === 97) shuntPivot(a_foot_l, a_foot_t + 43);
        else if (foot_pivot_angle === -90) shuntPivot(a_foot_l, a_foot_t - 43);
        else if (foot_pivot_angle === 90) shuntPivot(a_foot_l, a_foot_t + 43);
        else if (foot_pivot_angle === 172 || foot_pivot_angle === 180) shuntPivot(a_foot_l - 43, a_foot_t);
    }

    // Pivot

    submod.pivot = function (e) {

        if (TRIPODS.game_state.ignore_user_input || TRIPODS.game_state.level_win) {
            return false;
        }

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
                }, mod.config.animation.default.duration);
            } else postPivot(obj.foot, obj.count);
        };

        function abortPivot(obj) {

            if (obj.move) {

                const anim_obj = {};
                const foot = document.getElementById(obj.foot);

                if (obj.anim_params.left === obj.orig_coords.left) // If x positions match between current foot position and where it should pivot to, calculate direction the foot should shudder
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
                    }, mod.config.animation.default.duration * 0.83);

                }, mod.config.animation.default.duration * 0.83);
            } else pivot_foot_count++;
        };

        function startPivot(callback) {
            TRIPODS.game_state.ignore_user_input = 1;

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

            var left = parseFloat(getComputedStyle(document.getElementById(foot))["left"]),
                top = parseFloat(getComputedStyle(document.getElementById(foot))["top"]),
                anim_params, // Where feet will move to if the move is valid (e.g. doesn't encounter blocker UI element)
                foot_new_position_left, foot_new_position_top;

            if (foot_pivot_sequence[count] !== null) { // If foot should move

                if (foot_pivot_sequence[count][0] === 'left') {

                    // Get new foot coords
                    if (foot_pivot_sequence[count][1] === '-') foot_new_position_left = left - TRIPODS.ui_attributes.el_side;
                    else if (foot_pivot_sequence[count][1] === '+') foot_new_position_left = left + TRIPODS.ui_attributes.el_side;

                    anim_params = { 'left': foot_new_position_left, top: top }; // Store parameters for animation

                } else if (foot_pivot_sequence[count][0] === 'top') {

                    if (foot_pivot_sequence[count][1] === '-') foot_new_position_top = top - TRIPODS.ui_attributes.el_side;
                    else if (foot_pivot_sequence[count][1] === '+') foot_new_position_top = top + TRIPODS.ui_attributes.el_side;

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

                TRIPODS.game_state.updateMoveCounter();
                TRIPODS.game_state.checkWin();

                TRIPODS.game_state.ignore_user_input = 0;
                clearInterval(pivot_check);
            } else if (pivot_foot_count === 3 && block_collide_via_pivot) {
                TRIPODS.game_state.ignore_user_input = 0;
                clearInterval(pivot_check);
            }
        }, 100);

        // Which feet should move?
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

        const foot = document.getElementById(e.currentTarget.id); // Non-jQuery

        function animateBoundaryIntersect(left, top) {

            foot.style.left = `${left}px`;
            foot.style.top = `${top}px`;

            setTimeout(bounceBack, mod.config.animation.default.duration * 1.67);
        };

        function bounceBack() {

            foot.style.left = `${orig_pos_x}px`;
            foot.style.top = `${orig_pos_y}px`;

            setTimeout(function () {
                TRIPODS.game_state.ignore_user_input = 0;
            }, mod.config.animation.default.duration * 1.67);
        };

        function abortSwipe() {
            setTimeout(function () {
                foot.style.left = `${orig_pos_x}px`;
                foot.style.top = `${orig_pos_y}px`;

                setTimeout(function () {
                    TRIPODS.game_state.ignore_user_input = 0;
                }, mod.config.animation.default.duration * 2.5);
            }, mod.config.animation.default.duration * 0.42);
        };

        // Finish swipe movement
        function finishSwipe() {
            foot.style.zIndex = 1000; // Reset z-index
            TRIPODS.game_state.ignore_user_input = 0;
            submod.calculatePivotState();
            submod.repositionPivot();
            TRIPODS.game_state.updateMoveCounter();
            TRIPODS.game_state.checkWin();
        };

        // Move the swiped foot
        function startSwipe(left, top, ms, callback) {
            TRIPODS.game_state.ignore_user_input = 1;

            foot.style.left = `${left}px`;
            foot.style.top = `${top}px`;

            setTimeout(function () {
                if (typeof (callback) == "function") callback(); // Call either finishSwipe() or bouncBack()
            }, ms);
        };

        function shiftPivot(left, top) { // Initial adjustment of pivot (happens simultaneously with foot move)
            TRIPODS.game_state.ignore_user_input = true;

            const pivotor = document.getElementsByClassName("pivitor")[0];

            if (!left && top)
                anim_params = { top: top };
            else if (left && !top)
                anim_params = { left: left };
            else if (left && top)
                anim_params = { left: left, top: top };

            Object.keys(anim_params).forEach(function (key) {
                pivotor.style[key] = `${anim_params[key]}px`;
            });

            setTimeout(function () {
                TRIPODS.game_state.ignore_user_input = false;
            }, mod.config.animation.default.duration * 2.5);
        };

        // Store coords of elements before any elements are moved
        orig_pos_x = parseInt(getComputedStyle(foot)["left"]);
        orig_pos_y = parseInt(getComputedStyle(foot)["top"]);

        const foot_id = foot.getAttribute("id"); // ID of swiped foot
        const angles = []; // Angles between swiped foot and other two feet
        const other_foot_coords = []; // Coords of other two feet
        let left = parseFloat(getComputedStyle(document.getElementById(e.currentTarget.id))["left"]);
        let top = parseFloat(getComputedStyle(document.getElementById(e.currentTarget.id))["top"]);
        let pivot_left = parseFloat(getComputedStyle(document.querySelector(".pivitor"))["left"]);
        let pivot_top = parseFloat(getComputedStyle(document.querySelector(".pivitor"))["top"]);
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
                pivot_left -= cell_len;
                pivot_top -= control_padding;
                swipe_angle = 'nw';
            } else if (angle_swiped_and_A === -153) { // NNW
                left -= (cell_len * 2);
                top -= (cell_len * 3);
                pivot_left -= control_padding;
                pivot_top -= cell_len;
                swipe_angle = 'nnw';
            } else if (angle_swiped_and_A === -63) { // NE
                left += (cell_len * 3);
                top -= (cell_len * 2);
                pivot_left += cell_len;
                pivot_top -= control_padding;
                swipe_angle = 'ne';
            } else if (angle_swiped_and_A === -26) { // NNE
                left += (cell_len * 2);
                top -= (cell_len * 3);
                pivot_left += control_padding;
                pivot_top -= cell_len;
                swipe_angle = 'nne';
            } else if (angle_swiped_and_A === 116) { // SW
                left -= (cell_len * 3);
                top += (cell_len * 2);
                pivot_left -= cell_len;
                pivot_top += control_padding;
                swipe_angle = 'sw';
            } else if (angle_swiped_and_A === 153) { // SSW
                left -= (cell_len * 2);
                top += (cell_len * 3);
                pivot_left -= control_padding;
                pivot_top += cell_len;
                swipe_angle = 'ssw';
            } else if (angle_swiped_and_A === 63) { // SE
                left += (cell_len * 3);
                top += (cell_len * 2);
                pivot_left += cell_len;
                pivot_top += control_padding;
                swipe_angle = 'se';
            } else if (angle_swiped_and_A === 26) { // SSE
                left += (cell_len * 2);
                top += (cell_len * 3);
                pivot_left += control_padding;
                pivot_top += cell_len;
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
                    pivot_left -= cell_len * 2 + control_padding;
                    pivot_top = null;
                    swipe_angle = 'w';
                } else { // East
                    left += (cell_len * 4);
                    top = top;
                    pivot_left += cell_len * 2 - control_padding;
                    pivot_top = null;
                    swipe_angle = 'e';
                }
            } else if (axis_to_check === 'y') {
                if (other_foot_coords[0].y < foot_coords.y) { // North
                    left = left;
                    top -= (cell_len * 4);
                    pivot_left = null;
                    pivot_top -= cell_len * 2;
                    swipe_angle = 'n';
                } else { // South
                    left = left;
                    top += (cell_len * 4);
                    pivot_left = null;
                    pivot_top += cell_len * 2;
                    swipe_angle = 's';
                }
            }
        }

        // Check whether boundary has been intersected

        const boundary_check = boundaryIntersected(left, top);
        block_collide = elementCollision(left, top);

        if (boundary_check) { // If swiped off the board

            TRIPODS.game_state.ignore_user_input = 1;

            const a_foot = submod.getAFoot(); // Foot at position A
            const a_foot_left = parseFloat(getComputedStyle(a_foot)["left"]);
            const a_foot_top = parseFloat(getComputedStyle(a_foot)["top"]);

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

            // e.gesture.stopDetect();

            return false;
        }

        foot.style.zIndex = 2000; // Bring foot to top

        if (block_collide) {
            startSwipe(left, top, mod.config.animation.default.duration * 1.25, abortSwipe);
        } else {
            startSwipe(left, top, mod.config.animation.default.duration * 2.5, finishSwipe);
            shiftPivot(pivot_left, pivot_top);
        }
    }

    return submod;

}(TRIPODS || {}));

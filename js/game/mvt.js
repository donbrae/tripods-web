TRIPODS.mvt = (function (mod) {

  // Public obj

  var submod = {
    measurements: {
      container_offset_l: '',
      container_offset_t: '',
      container_width: '',
      container_height: '',
      cells_in_row: '',
      cells_in_column: ''
    }
  };

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
      a_foot_ctr_pt = TRIPODS.fun.getCenterPoint(a_foot),
      other_feet = [],
      foot1_ctr = TRIPODS.fun.getCenterPoint(document.getElementById("foot1")),
      foot2_ctr = TRIPODS.fun.getCenterPoint(document.getElementById("foot2")),
      foot3_ctr = TRIPODS.fun.getCenterPoint(document.getElementById("foot3"));

    document.getElementsByClassName("foot").forEach(el => {
      if (el.getAttribute('id') !== a_foot.getAttribute('id')) {
        other_feet.push(TRIPODS.fun.getCenterPoint(el));
      }
    });

    if (other_feet[0].y === other_feet[1].y) {	// If other feet are at same position on y axis
      if (other_feet[0].y > a_foot_ctr_pt.y) { // 'A' foot in pos. 0

        updatePivotCounter('#' + foot_id, 0); // Set 'A' foot to position 0

        // Set the other two feet
        if (foot_id === 'foot1') {
          if (foot3_ctr.x < foot2_ctr.x) {
            updatePivotCounter('#foot2', 4);
            updatePivotCounter('#foot3', 8);
          } else if (foot3_ctr.x > foot2_ctr.x) {
            updatePivotCounter('#foot2', 8);
            updatePivotCounter('#foot3', 4);
          }
        } else if (foot_id === 'foot2') {
          if (foot1_ctr.x < foot3_ctr.x) {
            updatePivotCounter('#foot1', 8);
            updatePivotCounter('#foot3', 4);
          } else if (foot1_ctr.x > foot3_ctr.x) {
            updatePivotCounter('#foot1', 4);
            updatePivotCounter('#foot3', 8);
          }
        } else if (foot_id === 'foot3') {
          if (foot2_ctr.x < foot1_ctr.x) {
            updatePivotCounter('#foot1', 4);
            updatePivotCounter('#foot2', 8);
          } else if (foot2_ctr.x > foot1_ctr.x) {
            updatePivotCounter('#foot1', 8);
            updatePivotCounter('#foot2', 4);
          }
        }

      } else { // A foot in pos. 6

        updatePivotCounter('#' + foot_id, 6);

        if (foot_id === 'foot1') {
          if (foot3_ctr.x < foot2_ctr.x) {
            updatePivotCounter('#foot2', 2);
            updatePivotCounter('#foot3', 10);
          } else if (foot3_ctr.x > foot2_ctr.x) {
            updatePivotCounter('#foot2', 10);
            updatePivotCounter('#foot3', 2);
          }
        } else if (foot_id === 'foot2') {
          if (foot1_ctr.x < foot3_ctr.x) {
            updatePivotCounter('#foot1', 10);
            updatePivotCounter('#foot3', 2);
          } else if (foot1_ctr.x > foot3_ctr.x) {
            updatePivotCounter('#foot1', 2);
            updatePivotCounter('#foot3', 10);
          }
        } else if (foot_id === 'foot3') {
          if (foot2_ctr.x < foot1_ctr.x) {
            updatePivotCounter('#foot1', 2);
            updatePivotCounter('#foot2', 10);
          } else if (foot2_ctr.x > foot1_ctr.x) {
            updatePivotCounter('#foot1', 10);
            updatePivotCounter('#foot2', 2);
          }
        }
      }
    } else if (other_feet[0].x === other_feet[1].x) { // If other feet match on the x axis

      if (other_feet[0].x > a_foot_ctr_pt.x) {

        // Pos. 8
        updatePivotCounter('#' + foot_id, 9);

        if (foot_id === 'foot1') {
          if (foot3_ctr.y < foot2_ctr.y) {
            updatePivotCounter('#foot2', 5);
            updatePivotCounter('#foot3', 1);
          } else if (foot3_ctr.y > foot2_ctr.y) {
            updatePivotCounter('#foot2', 1);
            updatePivotCounter('#foot3', 5);
          }
        } else if (foot_id === 'foot2') {
          if (foot1_ctr.y < foot3_ctr.y) {
            updatePivotCounter('#foot1', 1);
            updatePivotCounter('#foot3', 5);
          } else if (foot1_ctr.y > foot3_ctr.y) {
            updatePivotCounter('#foot1', 5);
            updatePivotCounter('#foot3', 1);
          }
        } else if (foot_id === 'foot3') {
          if (foot2_ctr.y < foot1_ctr.y) {
            updatePivotCounter('#foot1', 5);
            updatePivotCounter('#foot2', 1);
          } else if (foot2_ctr.y > foot1_ctr.y) {
            updatePivotCounter('#foot1', 1);
            updatePivotCounter('#foot2', 5);
          }
        }
      } else {

        // Pos. 3
        updatePivotCounter('#' + foot_id, 3);

        if (foot_id === 'foot1') {
          if (foot3_ctr.y < foot2_ctr.y) {
            updatePivotCounter('#foot2', 7);
            updatePivotCounter('#foot3', 11);
          } else if (foot3_ctr.y > foot2_ctr.y) {
            updatePivotCounter('#foot2', 11);
            updatePivotCounter('#foot3', 7);
          }
        } else if (foot_id === 'foot2') {
          if (foot1_ctr.y < foot3_ctr.y) {
            updatePivotCounter('#foot1', 11);
            updatePivotCounter('#foot3', 7);
          } else if (foot1_ctr.y > foot3_ctr.y) {
            updatePivotCounter('#foot1', 7);
            updatePivotCounter('#foot3', 11);
          }
        } else if (foot_id === 'foot3') {
          if (foot2_ctr.y < foot1_ctr.y) {
            updatePivotCounter('#foot1', 7);
            updatePivotCounter('#foot2', 11);
          } else if (foot2_ctr.y > foot1_ctr.y) {
            updatePivotCounter('#foot1', 11);
            updatePivotCounter('#foot2', 7);
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

        document.getElementsByClassName("foot").forEach(el => { // For each of the other two feet
          if (el.getAttribute("id") !== foot.getAttribute("id")) {
            angles.push(TRIPODS.fun.getAngleEl(foot, el));
          }
        });

        a_found = 1;

        // Compare the two angles
        angles.forEach(element => {
          let angle = parseFloat(el);

          if (angle === 0 || angle === 90 || angle === 180 || angle === -90) {
            a_found = 0;
            return false;
          }
        });

        if (a_found) {
          a_foot = foot; // Set A-point foot // > Why is this being set as a global variable?
          return true;
        } else {
          return false;
        }
      }

    // Get A point of triangle
    document.getElementsByClassName("foot").forEach(el => {
      if (compareToOtherFeet(el)) { // If 'A' foot
        foot = el;
        return false;
      }
    });

    return foot;
  }

  // Reposition pivot control after pivot
  submod.repositionPivot = function () {

    var $a_foot, $a_foot_l, $a_foot_t, foot_pivot_angle, foot_css,
      $pivot = $('.pivitor');

    shuntPivot = function (left, top) {
      $pivot.animate({
        left: left,
        top: top
      }, 100);
    };

    $a_foot = submod.getAFoot(); // Get foot at 'A' point of triangle
    foot_pivot_angle = parseInt(TRIPODS.fun.getAngleEl($a_foot, $('.pivitor'))); // Get angle between it and pivitor

    $a_foot_l = parseFloat($a_foot.css('left'));
    $a_foot_t = parseFloat($a_foot.css('top'));

    // Move pivitor depending on angle
    if (foot_pivot_angle === 0 || foot_pivot_angle === 7) shuntPivot($a_foot_l + 43, $a_foot_t);
    else if (foot_pivot_angle === -82) shuntPivot($a_foot_l, $a_foot_t - 43);
    else if (foot_pivot_angle === -172) shuntPivot($a_foot_l - 43, $a_foot_t);
    else if (foot_pivot_angle === 97) shuntPivot($a_foot_l, $a_foot_t + 43);
    else if (foot_pivot_angle === -90) shuntPivot($a_foot_l, $a_foot_t - 43);
    else if (foot_pivot_angle === 90) shuntPivot($a_foot_l, $a_foot_t + 43);
    else if (foot_pivot_angle === 172 || foot_pivot_angle === 180) shuntPivot($a_foot_l - 43, $a_foot_t);
  }

  // Private objects

  var foot_pivot_sequence = [
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
  ],

    foot_rad = TRIPODS.ui_attributes.el_side / 2,
    orig_pos_x, orig_pos_y,

    boundary_check, block_collide,
    control_padding = TRIPODS.ui_attributes.control_padding,
    cell_len = TRIPODS.ui_attributes.el_side,

    // Foot hits one of the four walls
    boundaryIntersected = function (left, top) {
      if (left < -control_padding) return 'left'; // Hits left container boundary
      else if (left > cell_len * (submod.measurements.cells_in_row - 1) - control_padding) return 'right';
      else if (top < -control_padding) return 'top';
      else if (top > cell_len * (submod.measurements.cells_in_column - 1) - control_padding) return 'bottom';

      return false;
    },

    elementCollision = function (left, top) {
      var block_coords = TRIPODS.game_state.block_coords,
        collide = 0;

      $.each(block_coords, function () {
        if (this.left === left && this.top === top) collide = 1;
      });

      if (collide) return true;
      else return false;
    }

  // Update counter for each foot to keep track of where it is in the foot_pivot_sequence
  updatePivotCounter = function (foot, val) {
    switch (foot) {
      case '#foot1':
        count_foot1 = val;
        break;
      case '#foot2':
        count_foot2 = val;
        break;
      case '#foot3':
        count_foot3 = val;
    }
  }

  // Pivot

  submod.pivot = function (e) {
    e.gesture.preventDefault();

    if (TRIPODS.game_state.ignore_user_input || TRIPODS.game_state.level_win) {
      e.gesture.stopDetect(); return false;
    }

    var pivot_check,
      pivot_foot_count = 0,
      foot_move_data = [],
      block_collide_via_pivot = 0,

      postPivot = function (foot, count) {
        updatePivotCounter(foot, count);
        pivot_foot_count++;
      },

      finishPivot = function (obj) {
        if (obj.move) {
          $(obj.foot).animate(obj.anim_params, 240, 'easeInOutBack', function () {
            postPivot(obj.foot, obj.count);
          });
        } else postPivot(obj.foot, obj.count);
      },

      abortPivot = function (obj) {

        if (obj.move) {

          var anim_obj = {};

          if (obj.anim_params.left === obj.orig_coords.left) anim_obj.top = obj.orig_coords.top + (obj.anim_params.top - obj.orig_coords.top) / 4; // If x positions match between current foot position and where it should pivot to, calculate direction the foot should shudder
          else if (obj.anim_params.top === obj.orig_coords.top) anim_obj.left = obj.orig_coords.left + (obj.anim_params.left - obj.orig_coords.left) / 4;

          $(obj.foot).animate(anim_obj, 100, 'linear', function () {
            $(obj.foot).animate(obj.orig_coords, 100, 'linear', function () {
              pivot_foot_count++;
            });
          });
        } else pivot_foot_count++;
      },

      startPivot = function (callback) {
        TRIPODS.game_state.ignore_user_input = 1;

        $.each(foot_move_data, function () {

          // Amend count
          if (this.count === 11) this.count = 0;
          else this.count++;

          if (typeof callback !== 'undefined' && typeof callback === 'function') callback(this);
        });
      },


      /**
       * @param {String} foot - ID of element
       * @param {Number} count
       */
      checkWhichFeetShouldPivot = function (foot, count) {

        var left = parseFloat(getComputedStyle(document.getElementById(foot))["left"]),
          top = parseFloat(getComputedStyle(document.getElementById(foot))["top"]),
          anim_params,
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
            foot: `#${foot}`,
            move: 1,
            count: count,
            anim_params: anim_params,
            orig_coords: {
              left: left,
              top: top
            }
          });

          block_collide = elementCollision(anim_params.left, anim_params.top);
          if (block_collide) block_collide_via_pivot = 1;

        } else if (foot_pivot_sequence[count] === null) { // If foot isn't to move this time
          foot_move_data.push({
            foot: `#${foot}`,
            move: 0,
            count: count
          });
        }
      };

    if (TRIPODS.game_state.ignore_user_input) return false;

    pivot_check = setInterval(function () { // Check for completion of pivot

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
    checkWhichFeetShouldPivot('foot1', count_foot1);
    checkWhichFeetShouldPivot('foot2', count_foot2);
    checkWhichFeetShouldPivot('foot3', count_foot3);

    if (!block_collide_via_pivot) startPivot(finishPivot); // If no block go pivot
    else if (block_collide_via_pivot) startPivot(abortPivot); // Don't pivot
  }

  // Swipe

  submod.swipe = function (e) {

    e.gesture.preventDefault();

    if (TRIPODS.game_state.ignore_user_input || TRIPODS.game_state.level_win) {
      e.gesture.stopDetect(); return false;
    }

    var foot = document.getElementById(e.currentTarget.id), // Non-jQuery
      $foot = $('#' + e.currentTarget.id),
      foot_id, // Id of swiped foot
      $a_foot = submod.getAFoot(), // Foot at position A
      foot_coords = TRIPODS.fun.getCenterPoint(foot), // Coords of swiped foot
      angle_swiped_and_A, // Angle between swiped foot and foot at position A
      angles = [], // Angles between swiped foot and other two feet
      other_foot_coords = [], // Coords of other two feet
      axis_to_check, // When swiping horizontally or vertically
      angle,
      left = parseFloat(getComputedStyle(document.getElementById(e.currentTarget.id))["left"]),
      top = parseFloat(getComputedStyle(document.getElementById(e.currentTarget.id))["top"]),
      pivot_left = parseFloat(getComputedStyle(document.querySelector(".pivitor"))["left"]),
      pivot_top = parseFloat(getComputedStyle(document.querySelector(".pivitor"))["top"]),
      swipe_diagonally = 0,
      swipe_angle,

      animateBoundaryIntersect = function (left, top) {
        $foot.animate({
          left: left,
          top: top
        }, 200, 'easeOutBack', function () {
          bounceBack();
        });
      },

      bounceBack = function () {
        $foot.animate({
          left: orig_pos_x,
          top: orig_pos_y
        }, 200, 'easeOutBounce', function () {
          TRIPODS.game_state.ignore_user_input = 0;
        });
      },

      abortSwipe = function () {
        var t = setTimeout(function () {
          $foot.animate({
            left: orig_pos_x,
            top: orig_pos_y
          }, 300, 'easeOutBounce', function () {
            TRIPODS.game_state.ignore_user_input = 0;
          });
        }, 50);
      },

      // Finish swipe movement
      finishSwipe = function () {
        $foot.css('z-index', 1000); // Reset z-index
        TRIPODS.game_state.ignore_user_input = 0;
        submod.calculatePivotState();
        submod.repositionPivot();
        TRIPODS.game_state.updateMoveCounter();
        TRIPODS.game_state.checkWin();
      },

      // Move the swiped foot
      startSwipe = function (left, top, easing, ms, callback) {
        TRIPODS.game_state.ignore_user_input = 1;

        $foot.animate({
          left: left,
          top: top
        }, ms, easing, function () {
          if (typeof callback !== 'undefined' && typeof callback === 'function') callback.call();	// Call either finishSwipe or bouncBack
        });
      },

      shiftPivot = function (left, top) { // Initial adjustment of pivot (happens simultaneously with foot move)
        var obj;

        TRIPODS.game_state.ignore_user_input = 1;

        if (!left && top) obj = { top: top };
        else if (left && !top) obj = { left: left };
        else if (left && top) obj = { left: left, top: top };

        $('.pivitor').animate(obj, 300, function () {
          TRIPODS.game_state.ignore_user_input = 0;
        });
      };

    if (e.type === 'touch' && !TRIPODS.game_state.ignore_user_input) { // Store coords on first touch
      orig_pos_x = parseInt($foot.css('left'));
      orig_pos_y = parseInt($foot.css('top'));
    }

    if (e.type === 'swipe') {

      foot_id = $foot.attr('id');

      // Get angle between swiped foot and other two feet
      document.getElementsByClassName("foot").forEach(el => {
        if (el.getAttribute("id") !== foot_id) {
          angles.push(TRIPODS.fun.getAngleEl(foot, el));
          other_foot_coords.push(TRIPODS.fun.getCenterPoint(el));
        }
      });

      // Compare the two angles
      $.each(angles, function () {
        angle = parseFloat(this);
        if (angle === 0 || angle === 90 || angle === 180 || angle === -90) swipe_diagonally = 1;
      });

      // Which direction to swipe in
      if (swipe_diagonally) {

        angle_swiped_and_A = parseInt(TRIPODS.fun.getAngleEl($foot, $a_foot));

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
        // Check whether two other feet are aligned horizontally or vertically
        if (other_foot_coords[0].y === other_foot_coords[1].y) axis_to_check = 'y';
        else if (other_foot_coords[0].x === other_foot_coords[1].x) axis_to_check = 'x';

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

      boundary_check = boundaryIntersected(left, top);
      block_collide = elementCollision(left, top);

      if (boundary_check) { // If swiped off the board

        TRIPODS.game_state.ignore_user_input = 1;

        // Animate depending on which wall was hit and at which angle
        if (boundary_check === 'bottom' && swipe_angle === 's') {
          animateBoundaryIntersect(orig_pos_x, cell_len * (submod.measurements.cells_in_column - 1) - control_padding);
        } else if (boundary_check === 'bottom' && swipe_angle === 'ssw') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) + cell_len / 1.5, cell_len * (submod.measurements.cells_in_column - 1) - control_padding);
        } else if (boundary_check === 'bottom' && swipe_angle === 'sse') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) - cell_len / 1.5, cell_len * (submod.measurements.cells_in_column - 1) - control_padding);
        } else if (boundary_check === 'top' && swipe_angle === 'n') {
          animateBoundaryIntersect(orig_pos_x, -control_padding);
        } else if (boundary_check === 'top' && swipe_angle === 'nne') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) - cell_len / 1.5, -control_padding);
        } else if (boundary_check === 'top' && swipe_angle === 'nnw') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) + cell_len / 1.5, -control_padding);
        } else if (boundary_check === 'left' && swipe_angle === 'w') {
          animateBoundaryIntersect(-control_padding, orig_pos_y);
        } else if (boundary_check === 'left' && swipe_angle === 'sw') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) - cell_len, parseFloat($a_foot.css('top')) - cell_len * 0.7);
        } else if (boundary_check === 'left' && swipe_angle === 'nw') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) - cell_len, parseFloat($a_foot.css('top')) + cell_len * 0.8);
        } else if (boundary_check === 'right' && swipe_angle === 'e') {
          animateBoundaryIntersect(cell_len * (submod.measurements.cells_in_row - 1) - control_padding, orig_pos_y);
        } else if (boundary_check === 'right' && swipe_angle === 'se') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) + cell_len, parseFloat($a_foot.css('top')) - cell_len * 0.7);
        } else if (boundary_check === 'right' && swipe_angle === 'ne') {
          animateBoundaryIntersect(parseFloat($a_foot.css('left')) + cell_len, parseFloat($a_foot.css('top')) + cell_len * 0.8);
        }

        e.gesture.stopDetect();

        return false;
      }

      $foot.css('z-index', 2000); // Bring foot to top

      if (block_collide) {
        startSwipe(left, top, 'linear', 150, abortSwipe);
      } else {
        startSwipe(left, top, 'easeOutBack', 300, finishSwipe);
        shiftPivot(pivot_left, pivot_top);
      }
    }
  }

  return submod;

}(TRIPODS || {}));

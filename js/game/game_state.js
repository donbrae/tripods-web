TRIPODS.game_state = (function () {

    var submod = {
        initialised: 0,
        moves: 0,
        ignore_user_input: false, // E.g. when foot move is being animated
        level: 0,
        level_win: 0,
        block_coords: []
    },

        moves_span = document.querySelector("h2.score span"),
        foot_1_center, foot_2_center, foot_3_center, landing_1_center,
        landing_other_center = [];

    submod.updateMoveCounter = function () {
        submod.moves++;

        if (TRIPODS.events.state.hold) { // If the pivot is being held, don't bother fading
            moves_span.innerText = submod.moves;
        } else if (!TRIPODS.events.state.hold) {
            // > fade out moves_span
            moves_span.innerText = submod.moves;
            // > fade in moves_span
            submod.pivot_hold = 0;

        }
    }

    submod.getWinCoords = function () { // Store target center points

        landing_other_center.length = 0;
        landing_1_center = TRIPODS.utils.getCenterPoint(document.getElementsByClassName("landing_1")[0]);

        Array.prototype.forEach.call(document.getElementsByClassName("landing-other"), function (el) {
            landing_other_center.push(TRIPODS.utils.getCenterPoint(el));
        });
    }

    submod.checkWin = function () {

        var feet_on_target = [];

        foot_1_center = TRIPODS.utils.getCenterPoint(document.getElementById("foot1"));

        if (foot_1_center.x === landing_1_center.x && foot_1_center.y === landing_1_center.y) { // If foot 1 is on its target spot

            feet_on_target.push('foot1');

            foot_2_center = TRIPODS.utils.getCenterPoint(document.getElementById("foot2"));
            foot_3_center = TRIPODS.utils.getCenterPoint(document.getElementById("foot3"));

            // Check whether another foot is on target
            landing_other_center.forEach(item => {
                if (item.x === foot_2_center.x && item.y === foot_2_center.y) feet_on_target.push('foot2');
                else if (item.x === foot_3_center.x && item.y === foot_3_center.y) feet_on_target.push('foot3');
            });

            if (feet_on_target.length === 3) { // If all feet are on target
                onWin();
            }
        }
    }

    var onWin = function () { // Function to run on win

        submod.level_win = 1;

        clearTimeout(TRIPODS.events.state.hold_interval); // If user is has pivitor held, stop repeated calls to pivot function

        const active_layer = document.getElementsByClassName("layer-active")[0];
        active_layer.style.opacity = 0.1;
        setTimeout(function () {
            active_layer.style.opacity = 1;
            submod.ignore_user_input = false;
            TRIPODS.level_builder.showSuccessMessage();
        }, 600);
    }

    return submod;

}());

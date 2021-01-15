TRIPODS.game_state = (function () {

    var submod = {
        initialised: 0,
        moves: 0,
        ignore_user_input: false, // E.g. when foot move is being animated
        level: 0,
        level_win: 0,
        block_coords: [],
        three_color: false // Are all three feet different colours?
    },

        moves_span = document.querySelector("h2.score span"),
        landing_1, // Landing 1 center
        landing_2, // Landing 2 center
        landing_3, // Landing 3 center
        landing_other_center = []; // > DELETE

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

        landing_1 = TRIPODS.utils.getCenterPoint(document.querySelector(".landing-1"));
        landing_2 = TRIPODS.utils.getCenterPoint(document.querySelector(".landing-2"));
        landing_3 = TRIPODS.utils.getCenterPoint(document.querySelector(".landing-3"));

        landing_other_center.length = 0; // > DELETE

        // > DELETE
        Array.prototype.forEach.call(document.getElementsByClassName("landing-other"), function (el) {
            landing_other_center.push(TRIPODS.utils.getCenterPoint(el));
        });
    }

    submod.checkWin = function () {

        let win = false;
        const foot_1 = TRIPODS.utils.getCenterPoint(document.getElementById("foot1")); // Foot 1 center
        const foot_2 = TRIPODS.utils.getCenterPoint(document.getElementById("foot2"));
        const foot_3 = TRIPODS.utils.getCenterPoint(document.getElementById("foot3"));

        function landed(foot, landing) {
            return foot.x === landing.x && foot.y === landing.y
        }

        if (
            submod.three_color &&
            landed(foot_1, landing_1) &&
            landed(foot_2, landing_2) &&
            landed(foot_3, landing_3)
        ) {
            win = true;
        } else if (
            !submod.three_color &&
            landed(foot_1, landing_1) && // Foot 1 is on landing 1
            (landed(foot_2, landing_2) || landed(foot_2, landing_3)) &&
            (landed(foot_3, landing_3) || landed(foot_3, landing_2))
        ) {
            win = true;
        }

        if (win) // If all feet are on target
            onWin();
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

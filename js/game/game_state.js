TRIPODS.game_state = (function () {

    "use strict";

    const submod = {
        initialised: false,
        moves_made: [], // Selectors of moves successfully made this level
        ignore_user_input: false, // E.g. when foot move is being animated
        level: 0, // Also stored in TRIPODS_level in localStorage
        level_win: false,
        block_center_coords: [],
        tutorial_running: false,
        element_tapped: "", // Selector of most recent element tapped
        scores: [] // Also stored in TRIPODS_scores in localStorage
    };

    const moves_span = document.querySelector("h2.score span");
    const landing_2_3 = []; // When there are only two colours

    let landing_1_xy; // Landing 1 center
    let landing_2_xy; // Landing 2 center
    let landing_3_xy; // Landing 3 center

    submod.updateMoveCounter = function () {

        TRIPODS.game_state.moves_made.push(TRIPODS.game_state.element_tapped);

        if (TRIPODS.events.state.hold) { // If the pivot is being held, don't bother fading
            moves_span.innerText = submod.moves_made.length;
        } else if (!TRIPODS.events.state.hold) {
            // > fade out moves_span
            moves_span.innerText = submod.moves_made.length;
            // > fade in moves_span
            submod.pivot_hold = 0;

        }
    }

    submod.getWinCoords = function () { // Store target center points

        if (!document.querySelectorAll(".landing").length) {
            return false;
        }

        landing_2_3.length = 0;

        landing_1_xy = TRIPODS.utils.getCenterPoint(document.querySelector(".landing-1"));

        const landing_3 = document.querySelector(".landing-3");

        if (landing_3) {
            landing_2_xy = TRIPODS.utils.getCenterPoint(document.querySelector(".landing-2"));
            landing_3_xy = TRIPODS.utils.getCenterPoint(landing_3);
        } else {
            Array.prototype.forEach.call(document.querySelectorAll(".landing-2"), function (el) {
                landing_2_3.push(TRIPODS.utils.getCenterPoint(el));
            });
        }
    }

    // Store blocker coords (centre points)
    submod.getBlockerCoords = function() {
        TRIPODS.game_state.block_center_coords.length = 0;
        Array.prototype.forEach.call(document.getElementsByClassName("block"), block => {
            TRIPODS.game_state.block_center_coords.push(TRIPODS.utils.getCenterPoint(block));
        });
    }

    submod.checkWin = function () {

        let win = false;
        const foot_1_xy = TRIPODS.utils.getCenterPoint(document.getElementById("foot1")); // Foot 1 center
        const foot_2_xy = TRIPODS.utils.getCenterPoint(document.getElementById("foot2")); // Foot 2 center
        const foot_3_xy = TRIPODS.utils.getCenterPoint(document.getElementById("foot3")); // Foot 3 center

        function landed(foot, landing) {
            return Math.abs(foot.x - landing.x) <= 10 && Math.abs(foot.y - landing.y) <= 10;
        }

        if (
            !landing_2_3.length && // Each of the three feet is a unique colour
            landed(foot_1_xy, landing_1_xy) &&
            landed(foot_2_xy, landing_2_xy) &&
            landed(foot_3_xy, landing_3_xy)
        ) {
            win = true;
        } else if (landing_2_3.length && // Feets 2 and 3 can be on either landing spot
            landed(foot_1_xy, landing_1_xy) && // Foot 1 is on landing 1
            (landed(foot_2_xy, landing_2_3[0]) || landed(foot_2_xy, landing_2_3[1])) &&
            (landed(foot_3_xy, landing_2_3[1]) || landed(foot_3_xy, landing_2_3[0]))
        ) {
            win = true;
        }

        if (win) {// If all feet are on target
            submod.ignore_user_input = true;
            setTimeout(onWin, 60);
        }
    }

    function onWin() { // Function to run on win

        submod.level_win = true;

        // clearTimeout(TRIPODS.events.state.hold_interval); // If user is has pivitor held, stop repeated calls to pivot function

        function addWinEffect() {

            let delay = 100;
            Array.prototype.forEach.call(document.querySelectorAll(".landing"), el => {
                setTimeout(function () {
                    el.querySelector(":first-child").classList.add("rainbow"); // SVG shape

                    if (window.confetti) {
                        confetti({
                            particleCount: 75,
                            spread: 360,
                            startVelocity: 20,
                            useWorker: true,
                            colors: ["#ff331c", "#fffc36", "#00f92f", "#002bfb", "#ff40fc", "#00fbfe"],
                            disableForReducedMotion: true,
                            origin: {
                                x: TRIPODS.utils.getCenterPoint(el).x / window.innerWidth * 100 / 100,
                                y: TRIPODS.utils.getCenterPoint(el).y / window.innerHeight * 100 / 100
                            }
                        });
                    }
                }, delay);
                delay += 100;
            });
        }

        function removeWinEffect() {
            Array.prototype.forEach.call(document.querySelectorAll(".landing > :first-child"), el => {
                el.classList.remove("rainbow");
            });
        }

        TRIPODS.utils.fadeOut(".layer-active");
        TRIPODS.utils.fadeOut("#pivitor");

        const hame = ".info-panel > .hame";
        TRIPODS.utils.fadeOut(hame, 100, false);
        document.querySelector(hame).disabled = true;

        addWinEffect();
        setTimeout(function () {
            submod.ignore_user_input = false;
            TRIPODS.level_builder.showWinScreen();
            setTimeout(function () {
                TRIPODS.utils.fadeIn("#pivitor");
                TRIPODS.utils.fadeIn(".layer-active");
                removeWinEffect();
            }, 1000);
        }, 1750);

        // Store score if it's the best so far
        const score = TRIPODS.game_state.moves_made.length;
        const previous_best_score = TRIPODS.game_state.scores[submod.level];
        if (previous_best_score && score < previous_best_score || !previous_best_score) {
            TRIPODS.game_state.scores[submod.level] = score;
        }

        window.localStorage.setItem("TRIPODS_scores", TRIPODS.game_state.scores);
        if (TRIPODS.game_state.level < (TRIPODS.levels.length - 1)) {
            window.localStorage.setItem("TRIPODS_level", TRIPODS.game_state.level + 1); // Store next level in localStorage so that if user goes back to the launch screen the next level will be shown in the <select>
        }
    }

    return submod;

}());

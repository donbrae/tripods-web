TRIPODS.game_state = (function () {

    "use strict";

    const submod = {
        initialised: 0,
        moves_made: [], // Selectors of moves successfully made this level
        ignore_user_input: false, // E.g. when foot move is being animated
        level: 0,
        level_win: false,
        block_coords: [],
        tutorial_running: false,
        element_tapped: "" // Selector of most recent element tapped
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

    submod.checkWin = function () {

        let win = false;
        const foot_1_xy = TRIPODS.utils.getCenterPoint(document.getElementById("foot1")); // Foot 1 center
        const foot_2_xy = TRIPODS.utils.getCenterPoint(document.getElementById("foot2")); // Foot 2 center
        const foot_3_xy = TRIPODS.utils.getCenterPoint(document.getElementById("foot3")); // Foot 3 center

        function landed(foot, landing) {
            return foot.x === landing.x && foot.y === landing.y;
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

        if (TRIPODS.cfg.logging) TRIPODS.utils.log(`checkWin() -> win: ${win}`);

        if (win) // If all feet are on target
            onWin();
    }

    function onWin() { // Function to run on win

        if (TRIPODS.cfg.logging) TRIPODS.utils.log("onWin()");

        submod.level_win = true;

        clearTimeout(TRIPODS.events.state.hold_interval); // If user is has pivitor held, stop repeated calls to pivot function

        function addWinEffect() {

            if (TRIPODS.cfg.logging) TRIPODS.utils.log("onWin() -> addWinEffect()");

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

        const active_layer = document.getElementsByClassName("layer-active")[0];
        active_layer.style.opacity = 0;
        TRIPODS.utils.fadeOut("#pivitor");
        addWinEffect();
        setTimeout(function () {
            submod.ignore_user_input = false;
            // TRIPODS.level_builder.showSuccessMessage();
            setTimeout(function () {
                TRIPODS.utils.fadeIn("#pivitor");
                active_layer.style.opacity = 1;
                removeWinEffect();
            }, 1000);
        }, 1750);
    }

    return submod;

}());

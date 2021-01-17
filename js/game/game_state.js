TRIPODS.game_state = (function () {

    const submod = {
        initialised: 0,
        moves: 0,
        ignore_user_input: false, // E.g. when foot move is being animated
        level: 0,
        level_win: 0,
        block_coords: []
    };

    const moves_span = document.querySelector("h2.score span");
    const landing_2_3 = []; // When there are only two colours

    let landing_1_xy; // Landing 1 center
    let landing_2_xy; // Landing 2 center
    let landing_3_xy; // Landing 3 center

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
            return foot.x === landing.x && foot.y === landing.y
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

        if (win) // If all feet are on target
            onWin();
    }

    function onWin() { // Function to run on win

        submod.level_win = 1;

        clearTimeout(TRIPODS.events.state.hold_interval); // If user is has pivitor held, stop repeated calls to pivot function

        function addRainbowEffect() {
            document.querySelector(".landing-1 > circle").classList.add("rainbow");
            if (document.querySelector(".landing-3 > circle")) {
                setTimeout(function () {
                    document.querySelector(".landing-2 > circle").classList.add("rainbow");
                    setTimeout(function () {
                        document.querySelector(".landing-3 > circle").classList.add("rainbow");
                    }, 100);
                }, 100);
            } else {
                Array.prototype.forEach.call(document.querySelectorAll(".landing-2 > circle"), el => {
                    setTimeout(function () {
                        el.classList.add("rainbow");
                    }, 100);
                });
            }
        }

        function removeRainbowEffect() {
            document.querySelector(".landing-1 > circle").classList.add("rainbow");
            if (document.querySelector(".landing-3 > circle")) {
                document.querySelector(".landing-2 > circle").classList.remove("rainbow");
                document.querySelector(".landing-3 > circle").classList.remove("rainbow");
            } else {
                Array.prototype.forEach.call(document.querySelectorAll(".landing-2 > circle"), el => {
                    el.classList.remove("rainbow");
                });
            }

        }

        const active_layer = document.getElementsByClassName("layer-active")[0];
        active_layer.style.opacity = 0;
        TRIPODS.utils.fadeOut(".pivitor");
        // document.querySelector(".pivitor").style.opacity = 0;
        addRainbowEffect();
        setTimeout(function () {
            submod.ignore_user_input = false;
            TRIPODS.level_builder.showSuccessMessage();
            setTimeout(function () {
                TRIPODS.utils.fadeIn(".pivitor");
                active_layer.style.opacity = 1;
                removeRainbowEffect();
            }, 1000);
        }, 1250);
    }

    return submod;

}());

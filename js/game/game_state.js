TRIPODS.game_state = (function (_module) {

    "use strict";

    const _this = {
        initialised: false,
        moves_made: [], // Selectors of moves successfully made this level
        ignore_user_input: false, // E.g. when foot move is being animated
        level: 0, // Also stored in TRIPODS_level in localStorage
        level_running: false,
        block_center_coords: [],
        vortex_center_coords: [],
        tutorial_running: false,
        element_tapped: "", // Selector of most recent element tapped
        moves: [], // Record of best number of moves. Also stored in TRIPODS_moves in localStorage
        sound: undefined, // Boolean. Audio on/off (default set in cfg)
        guides: undefined // Boolean. On-screen guidance (default set in cfg)
    };

    const moves_span = document.querySelector("h2.moves span");
    const landing_2_3 = []; // When there are only two colours

    let landing_1_xy; // Landing 1 center
    let landing_2_xy; // Landing 2 center
    let landing_3_xy; // Landing 3 center

    _this.updateMoveCounter = function () {

        _module.game_state.moves_made.push(_module.game_state.element_tapped);

        if (_module.events.state.hold) { // If the pivot is being held, don't bother fading
            moves_span.innerText = _this.moves_made.length;
        } else if (!_module.events.state.hold) {
            // > fade out moves_span
            moves_span.innerText = _this.moves_made.length;
            // > fade in moves_span
            _this.pivot_hold = 0;

        }
    }

    _this.getWinCoords = function () { // Store target center points

        if (!document.querySelectorAll(".landing").length) {
            return false;
        }

        landing_2_3.length = 0;

        landing_1_xy = _module.utils.getCenterPoint(document.querySelector(".landing-1"));

        const landing_3 = document.querySelector(".landing-3");

        if (landing_3) {
            landing_2_xy = _module.utils.getCenterPoint(document.querySelector(".landing-2"));
            landing_3_xy = _module.utils.getCenterPoint(landing_3);
        } else {
            Array.prototype.forEach.call(document.querySelectorAll(".landing-2"), function (el) {
                landing_2_3.push(_module.utils.getCenterPoint(el));
            });
        }
    }

    // Store blocker coords (centre points)
    _this.getBlockerCoords = function() {
        _module.game_state.block_center_coords.length = 0;
        Array.prototype.forEach.call(document.getElementsByClassName("block"), block => {
            _module.game_state.block_center_coords.push(_module.utils.getCenterPoint(block));
        });
    }

    // Store vortex cords coords (centre points)
    _this.getVortexCoords = function() {
        _module.game_state.vortex_center_coords.length = 0;
        Array.prototype.forEach.call(document.getElementsByClassName("vortex"), vortex => {
            _module.game_state.vortex_center_coords.push(_module.utils.getCenterPoint(vortex));
        });
    }

    _this.checkWin = function () {

        let win = false;
        const foot_1_xy = _module.utils.getCenterPoint(document.getElementById("foot1")); // Foot 1 center
        const foot_2_xy = _module.utils.getCenterPoint(document.getElementById("foot2")); // Foot 2 center
        const foot_3_xy = _module.utils.getCenterPoint(document.getElementById("foot3")); // Foot 3 center

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

        if (win) { // If all feet are on target
            _this.ignore_user_input = true;
            setTimeout(onWin, 60);
        }
    }

    function onWin() { // Function to run on win

        _this.level_running = false;

        // clearTimeout(_module.events.state.hold_interval); // If user is has pivotor held, stop repeated calls to pivot function

        function addWinEffect() {

            let delay = 100;
            Array.prototype.forEach.call(document.querySelectorAll(".landing"), el => {
                setTimeout(function () {
                    el.querySelector(":first-child").classList.add("rainbow"); // SVG shape

                    const grid_width = _module.ui_attributes.grid_dimensions;

                    if (window.confetti) {
                        confetti({
                            particleCount: 75,
                            spread: grid_width > 414 ? grid_width / 1.7 : 220,
                            startVelocity: 20,
                            useWorker: true,
                            scalar: grid_width > 414 ? grid_width / 600 : 0.85,
                            colors: ["#ff331c", "#fffc36", "#00f92f", "#002bfb", "#ff40fc", "#00fbfe"],
                            disableForReducedMotion: true,
                            origin: {
                                x: _module.utils.getCenterPoint(el).x / window.innerWidth * 100 / 100,
                                y: _module.utils.getCenterPoint(el).y / window.innerHeight * 100 / 100
                            }
                        });
                    }
                }, delay);
                delay += 100;
            });
            _module.sound.play("win", delay * 0.5);
        }

        function removeWinEffect() {
            confetti.reset();
            Array.prototype.forEach.call(document.querySelectorAll(".landing > :first-child"), el => {
                el.classList.remove("rainbow");
            });
        }

        setTimeout(() => {
            _module.utils.fadeOut(".layer-active");
        }, 100);
        _module.utils.fadeOut("#pivotor");
        _module.utils.fadeOutAndDisable(".info-panel .hame");
        _module.utils.fadeOut("#sound", 100);
        _module.utils.fadeOut("#guides", 100);

        addWinEffect();

        // Store moves if it's the best so far
        const moves = _module.game_state.moves_made.length;
        const previous_best_moves = _module.game_state.moves[_this.level];
        if (previous_best_moves && moves < previous_best_moves || !previous_best_moves) {
            _module.game_state.moves[_this.level] = moves;
        }

        window.localStorage.setItem("TRIPODS_moves", _module.game_state.moves);
        if (_module.game_state.level < (_module.levels.length - 1)) {
            window.localStorage.setItem("TRIPODS_level", _module.game_state.level + 1); // Store next level in localStorage so that if user goes back to the launch screen the next level will be shown in the <select>
        }

        setTimeout(function () {
            _this.ignore_user_input = false;
            _module.level_builder.showWinScreen(previous_best_moves);
            setTimeout(removeWinEffect, 1000);
        }, 1750);
    }

    return _this;

}(TRIPODS || {}));

TRIPODS.level_builder = (function (_module) {

    "use strict";

    const _this = {};

    _this.runLevel = function () {
        _module.mvt.repositionPivot(true, 1000);
        _module.mvt.getMeasurements(); // Set UI measurements
        _module.mvt.calculatePivotState();
        _module.game_state.getWinCoords();
        _module.game_state.getBlockerCoords();
        _module.game_state.getVortexCoords();

        if (_module.tutorials.levels[_module.game_state.level]) {
            _module.game_state.tutorial_running = true;
        }

        _module.game_state.ignore_user_input = true;
        let delay = 120;
        Array.prototype.forEach.call(document.querySelectorAll(".foot"), foot => {
            setTimeout(function () {
                foot.classList.add("flash");
            }, delay);
            delay += 120;
        });

        setTimeout(function () {
            Array.prototype.forEach.call(document.querySelectorAll(".foot"), foot => {
                foot.classList.remove("flash");
            });

            _module.game_state.ignore_user_input = false;

            if (_module.game_state.tutorial_running) {
                _module.tutorials.placeTutorialElement();
            }

            if (_module.cfg.logging) _module.utils.log("Test log message");
        }, 1220);

    }

    _this.addUI = function () {
        _module.addElements(); // Add elements to grid
        _module.events.addEventListeners(); // Add event handlers

        const level = parseInt(_module.game_state.level);

        document.querySelector('h2.level span').innerText = level + 1; // Add level
        document.querySelector('h2.moves span.current').innerText = "0";

        const moves = _module.game_state.moves[level]; // Any previous best moves for this level
        if (moves) {
            document.querySelector('h2.moves span.best').innerText = `(Best: ${moves})`;
        } else {
            document.querySelector('h2.moves span.best').innerText = "";
        }

        window.localStorage.setItem("TRIPODS_level", _module.game_state.level); // Store current level in localStorage

        const last_layer = document.querySelector(".container > .layer:last-of-type");
        last_layer.classList.add("layer-active"); // Add 'layer-active' class to top layer

        setTimeout(() => {
            _module.utils.fadeOut(".screen-level-select", undefined, true); // On start
            _module.utils.fadeOut(".screen-win", undefined, true); // Level win
            _module.utils.fadeOut(".screen-lose", undefined, true); // Level lose
        }, 80);

        setTimeout(() => {
            const hame = ".info-panel > .hame";
            _module.utils.fadeIn(hame, 100);
            document.querySelector(hame).disabled = false;

            _module.utils.fadeIn(".container-game", undefined, () => {
                _this.runLevel();
            });
        }, 300);
    }

    _this.reset = function (callback) {
        _module.game_state.block_center_coords.length = 0; // Reset vortex data
        _module.game_state.vortex_center_coords.length = 0; // Reset block data
        _module.game_state.level_end = false;
        _module.game_state.tutorial_running = false;
        _module.game_state.moves_made.length = 0; // Empty array
        _module.game_state.element_tapped = "";
        _module.utils.fadeOut(".container-game", undefined, undefined, () => {
            Array.prototype.forEach.call(document.querySelectorAll(".layer"), function (el) {
                el.parentNode.removeChild(el);
            });

            if (typeof (callback) == "function") callback();
        });
    }

    _this.showWinScreen = function (previous_best) {
        setTimeout(function () {
            let moves = _module.game_state.moves_made.length;

            console.log(previous_best);

            document.querySelector(".screen-win h2 span.moves").innerText = moves; // Print number of moves

            const threshold = _module.levels[_module.game_state.level][1]; // Threshold for ★★★ rating
            let rating;

            if (moves <= threshold) {
                rating = "★★★";
            } else if (moves <= threshold * 2) {
                rating = "★★☆";
            } else if (moves) {
                rating = "★☆☆";
            }

            document.querySelector(".screen-win .rating").innerHTML = rating; // Print rating

            if (previous_best && moves < previous_best) { // Best previous moves
                _module.game_state.moves[_this.level] = moves;
                document.querySelector(".screen-win h2 span.best").innerText = "No bad: that’s a new personal record!";
            } else if (previous_best && moves > previous_best) {
                document.querySelector(".screen-win h2 span.best").innerText = `(Your record is ${previous_best} moves.)`;
            } else if (!previous_best && moves <= threshold) { // Perfect score on first attempt
                document.querySelector(".screen-win h2 span.best").innerText = `Well done!`;
            } else {
                document.querySelector(".screen-win h2 span.best").innerText = "";
            }

            const next_level = document.querySelector(".next-level");
            if (_module.game_state.level === _module.levels.length - 1 && next_level) {
                next_level.classList.add("hide");
            } else {
                next_level.classList.remove("hide");
            }

            _module.utils.fadeOut(".container-game");
            _module.utils.fadeIn(".screen-win");
        }, 500);
    }

    _this.showLoseScreen = function (message) {
        document.querySelector(".screen-lose > h2").innerHTML = message;
        _module.utils.fadeIn(".screen-lose", undefined, () => {
            _module.game_state.ignore_user_input = false;
        });
    }

    return _this;

}(TRIPODS || {}));

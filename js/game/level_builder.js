TRIPODS.level_builder = (function (_module) {

    "use strict";

    const _this = {};

    _this.runLevel = function () {
        document.querySelector('body').classList.add('game-running');
        _module.mvt.repositionPivot(true, 1000);
        _module.mvt.getMeasurements(); // Set UI measurements
        _module.mvt.calculatePivotState();
        _module.game_state.getWinCoords();
        _module.game_state.getBlockerCoords();
        _module.game_state.getVortexCoords();

        if (!_module.game_state.guides) {
            document.getElementById("pivotor").classList.add("hide-guide");
        }

        if (_module.tutorials.cfg.levels[_module.game_state.level]) {
            _module.game_state.tutorial_running = true;
        }

        _module.game_state.level_running = true;
        _module.game_state.ignore_user_input = true;

        // Highlight feet
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

            if (!_module.game_state.level_running) { // Check whether game is still running
                return false;
            }

            Howler.volume(1);
            _module.mvt.getNextPivot();
            _module.game_state.ignore_user_input = false;

            if (_module.game_state.tutorial_running) {
                _module.tutorials.placeTutorialElement();
            }
        }, 1220);

        _module.utils.sendStats(`function=runLevel&level=${_module.game_state.level + 1}`);
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
            _module.utils.fadeOut(".screen-privacy-policy", undefined, true);
            _module.utils.fadeOut(".screen-win", undefined, true); // Level win
            _module.utils.fadeOut(".screen-lose", undefined, true); // Level lose
        }, 80);

        setTimeout(() => {
            const hame = ".info-panel .hame";
            _module.utils.fadeIn(hame, 100);
            document.querySelector(hame).disabled = false;
            _module.utils.fadeIn("#sound", 100);
            _module.utils.fadeIn("#guides", 100);

            if (_module.game_state.color_scheme === "dark") {
                _module.utils.invertElements(".foot");
            }

            _module.utils.fadeIn(".container-game", 280, 180, () => {
                _this.runLevel();
            });
        }, 300);
    }

    _this.reset = function (callback) {
        _module.game_state.block_center_coords.length = 0; // Reset vortex data
        _module.game_state.vortex_center_coords.length = 0; // Reset block data
        _module.game_state.level_running = false;
        _module.game_state.tutorial_running = false;
        _module.game_state.moves_made.length = 0; // Empty array
        _module.tutorials.tutorial_animate_vertical = undefined;
        _module.tutorials.tutorial_fadein = undefined;
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
            const star = _module.cfg.svg_elements.star;
            const star_outline = _module.cfg.svg_elements.star_outline;

            document.querySelector(".screen-win h2 span.moves").innerText = moves; // Print number of moves

            const perfect = _module.levels[_module.game_state.level][1]; // Perfect, ★★★ rating
            let rating;

            if (moves <= perfect) { // Check whether lower that perfect too in case someone finds a quicker path than I've been able to
                rating = `${star}${star}${star}`;
            } else if (moves <= perfect * 2) {
                rating = `${star}${star}${star_outline}`;
            } else if (moves) {
                rating = `${star}${star_outline}${star_outline}`;
            }

            document.querySelector(".screen-win .rating").innerHTML = rating; // Print rating

            if (previous_best && moves < previous_best && moves > perfect) { // New high score, but not perfect
                _module.game_state.moves[_this.level] = moves;
                document.querySelector(".screen-win h2 span.best").innerText = "No bad: that’s a new personal record!";
            } else if (previous_best && moves > previous_best) {
                document.querySelector(".screen-win h2 span.best").innerText = `(Your record is ${previous_best} moves.)`;
            } else if (moves <= perfect) { // Perfect score
                _module.game_state.moves[_this.level] = moves;
                document.querySelector(".screen-win h2 span.best").innerText = `Perfect!`;
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

            _module.utils.sendStats(`function=showWinScreen&level=${_module.game_state.level + 1}&moves=${moves}&perfect=${perfect}`);
        }, 500);
    }

    _this.showLoseScreen = function (message) {
        document.querySelector(".screen-lose > h2").innerHTML = message;
        _module.utils.fadeIn(".screen-lose", undefined, undefined, () => {
            _module.game_state.ignore_user_input = false;
        });
    }

    return _this;

}(TRIPODS || {}));

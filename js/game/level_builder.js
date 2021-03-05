TRIPODS.level_builder = (function (mod) {

    "use strict";

    const submod = {};

    submod.runLevel = function () {
        TRIPODS.mvt.repositionPivot(true, 1000);
        TRIPODS.mvt.getMeasurements(); // Set UI measurements
        TRIPODS.mvt.calculatePivotState();
        TRIPODS.game_state.getWinCoords();
        TRIPODS.game_state.getBlockerCoords();
        TRIPODS.game_state.getVortexCoords();

        if (TRIPODS.tutorials.levels[mod.game_state.level]) {
            mod.game_state.tutorial_running = true;
        }

        TRIPODS.game_state.ignore_user_input = true;
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

            TRIPODS.game_state.ignore_user_input = false;

            if (mod.game_state.tutorial_running) {
                mod.tutorials.placeTutorialElement();
            }

            if (mod.cfg.logging) mod.utils.log("Test log message");
        }, 1220);

    }

    submod.addUI = function () {
        TRIPODS.addElements(); // Add elements to grid
        TRIPODS.events.addEventListeners(); // Add event handlers

        const level = parseInt(TRIPODS.game_state.level);

        document.querySelector('h2.level span').innerText = level + 1; // Add level
        document.querySelector('h2.moves span.current').innerText = "0";

        const moves = TRIPODS.game_state.moves[level]; // Any previous best moves for this level
        if (moves) {
            document.querySelector('h2.moves span.best').innerText = `(Best: ${moves})`;
        } else {
            document.querySelector('h2.moves span.best').innerText = "";
        }

        window.localStorage.setItem("TRIPODS_level", TRIPODS.game_state.level); // Store current level in localStorage

        const last_layer = document.querySelector(".container > .layer:last-of-type");
        last_layer.classList.add("layer-active"); // Add 'layer-active' class to top layer

        setTimeout(() => {
            TRIPODS.utils.fadeOut(".screen-level-select", undefined, true); // On start
            TRIPODS.utils.fadeOut(".screen-win", undefined, true); // Level win
            TRIPODS.utils.fadeOut(".screen-lose", undefined, true); // Level lose
        }, 80);

        setTimeout(() => {
            const hame = ".info-panel > .hame";
            TRIPODS.utils.fadeIn(hame, 100);
            document.querySelector(hame).disabled = false;

            TRIPODS.utils.fadeIn(".container-game", undefined, () => {
                submod.runLevel();
            });
        }, 300);
    }

    submod.reset = function (callback) {
        TRIPODS.game_state.block_center_coords.length = 0; // Reset vortex data
        TRIPODS.game_state.vortex_center_coords.length = 0; // Reset block data
        TRIPODS.game_state.level_end = false;
        TRIPODS.game_state.tutorial_running = false;
        TRIPODS.game_state.moves_made.length = 0; // Empty array
        TRIPODS.game_state.element_tapped = "";
        TRIPODS.utils.fadeOut(".container-game", undefined, undefined, () => {
            Array.prototype.forEach.call(document.querySelectorAll(".layer"), function (el) {
                el.parentNode.removeChild(el);
            });

            if (typeof (callback) == "function") callback();
        });
    }

    submod.showWinScreen = function (previous_best) {
        setTimeout(function () {
            let moves = TRIPODS.game_state.moves_made.length;

            console.log(previous_best);

            document.querySelector(".screen-win h2 span.moves").innerText = moves; // Print number of moves

            const threshold = TRIPODS.levels[TRIPODS.game_state.level][1]; // Threshold for ★★★ rating
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
                TRIPODS.game_state.moves[submod.level] = moves;
                document.querySelector(".screen-win h2 span.best").innerText = "No bad: that’s a new personal record!";
            } else if (previous_best && moves > previous_best) {
                document.querySelector(".screen-win h2 span.best").innerText = `(Your record is ${previous_best} moves.)`;
            } else if (!previous_best && moves <= threshold) { // Perfect score on first attempt
                document.querySelector(".screen-win h2 span.best").innerText = `Well done!`;
            } else {
                document.querySelector(".screen-win h2 span.best").innerText = "";
            }

            const next_level = document.querySelector(".next-level");
            if (TRIPODS.game_state.level === TRIPODS.levels.length - 1 && next_level) {
                next_level.classList.add("hide");
            } else {
                next_level.classList.remove("hide");
            }

            TRIPODS.utils.fadeOut(".container-game");
            TRIPODS.utils.fadeIn(".screen-win");
        }, 500);
    }

    submod.showLoseScreen = function (message) {
        document.querySelector(".screen-lose > h2").innerHTML = message;
        TRIPODS.utils.fadeIn(".screen-lose", undefined, () => {
            TRIPODS.game_state.ignore_user_input = false;
        });
    }

    return submod;

}(TRIPODS || {}));

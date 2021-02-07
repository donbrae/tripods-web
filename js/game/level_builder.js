TRIPODS.level_builder = (function (mod) {

    "use strict";

    const submod = {};

    submod.runLevel = function () {
        TRIPODS.mvt.repositionPivot();
        TRIPODS.mvt.getMeasurements(); // Set UI measurements
        TRIPODS.mvt.calculatePivotState();
        TRIPODS.game_state.getWinCoords();

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
            if (mod.game_state.tutorial_running) {
                mod.tutorials.placeTutorialElement();
            }
            Array.prototype.forEach.call(document.querySelectorAll(".foot"), foot => {
                foot.classList.remove("flash");
            });

            TRIPODS.game_state.ignore_user_input = false;
            console.log("qwertyui");
        }, 1560);

    }

    submod.addUI = function () {
        TRIPODS.addElements(); // Add elements to grid
        TRIPODS.events.addEventListeners(); // Add event handlers

        const level = parseInt(TRIPODS.game_state.level);

        document.querySelector('h2.level span').innerText = level + 1; // Add level
        document.querySelector('h2.score span.current').innerText = "0";

        const score = TRIPODS.game_state.scores[level]; // Any previous best score for this level
        if (score) {
            document.querySelector('h2.score span.best').innerText = `(Best: ${score})`;
        } else {
            document.querySelector('h2.score span.best').innerText = "";
        }

        window.localStorage.setItem("TRIPODS_level", TRIPODS.game_state.level); // Store current level in localStorage

        const last_layer = document.querySelector(".container > .layer:last-of-type");
        last_layer.classList.add("layer-active"); // Add 'layer-active' class to top layer
        // last_layer.classList.add("hide");

        setTimeout(function () {
            TRIPODS.utils.fadeOut(".splash"); // On start
            TRIPODS.utils.fadeIn(".outer-container"); // On start
            TRIPODS.utils.fadeOut(".message"); // Level win
        }, 150);

        setTimeout(function () {
            TRIPODS.utils.fadeIn(".container > .layer:last-of-type");
            setTimeout(submod.runLevel, 500);
        }, 3);
    }

    submod.reset = function (callback) {
        setTimeout(function () {
            TRIPODS.game_state.block_coords.length = 0; // Reset block data
            TRIPODS.game_state.level_win = false;
            TRIPODS.game_state.tutorial_running = false;
            TRIPODS.game_state.moves_made.length = 0; // Empty array
            TRIPODS.game_state.element_tapped = "";

            Array.prototype.forEach.call(document.querySelectorAll(".layer"), function (el) {
                el.parentNode.removeChild(el);
            });

            if (typeof (callback) == "function") callback();
        }, 120);
    }

    submod.showSuccessMessage = function () {
        setTimeout(function () {
            document.querySelector(".message h2 span").innerText = TRIPODS.game_state.moves_made.length; // Print number of moves
            const next_level = document.querySelector(".next-level");
            if (TRIPODS.game_state.level === TRIPODS.levels.length - 1 && next_level) {
                next_level.classList.add("hide");
            } else {
                next_level.classList.remove("hide");
            }

            TRIPODS.utils.fadeIn(".message");
        }, 500);
    }

    return submod;

}(TRIPODS || {}));

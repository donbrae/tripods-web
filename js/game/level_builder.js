TRIPODS.level_builder = (function (mod) {

    "use strict";

    const submod = {};

    submod.runLevel = function () {
        TRIPODS.mvt.repositionPivot();
        TRIPODS.mvt.getMeasurements(); // Set UI measurements
        TRIPODS.mvt.calculatePivotState();
        TRIPODS.game_state.getWinCoords();

        if (!TRIPODS.game_state.initialised) TRIPODS.game_state.initialised = 1; // Set initialised flag

        if (TRIPODS.tutorials.levels[mod.game_state.level]) {
            mod.game_state.tutorial_running = true;
        }

        const active_layer = document.getElementsByClassName("layer-active")[0];
        active_layer.style.opacity = 1;
        mod.tutorials.placeTutorialElement();
        // active_layer.style.opacity = 0.1;
        // setTimeout(function () {
        //     active_layer.style.opacity = 1;
        //     setTimeout(function () {
        //         active_layer.style.opacity = 0.1;
        //         setTimeout(function () {
        //             active_layer.style.opacity = 1;
        //             if (mod.game_state.tutorial_running)
        //                 mod.tutorials.placeTutorialElement();
        //         }, 500);
        //     }, 500);
        // }, 500);
    }

    submod.addUI = function () {
        TRIPODS.addElements(); // Add elements to grid
        TRIPODS.events.addEventListeners(); // Add event handlers

        document.querySelector('h2.level span').innerText = TRIPODS.game_state.level + 1; // Add level
        document.querySelector('h2.score span').innerText = TRIPODS.game_state.moves_made.length; // Add number of moves

        const last_layer = document.querySelector(".container > .layer:last-of-type");
        last_layer.classList.add("layer-active"); // Add 'layer-active' class to top layer
        // last_layer.classList.add("hide");

        setTimeout(function () {
            TRIPODS.utils.fadeOut(".blank-overlay"); // On launch
            TRIPODS.utils.fadeOut(".message"); // Level win
        }, 150);

        setTimeout(function () {
            TRIPODS.utils.fadeIn(".container > .layer:last-of-type");
            // last_layer.style.display = "inherit";
            setTimeout(submod.runLevel, 500);
        }, 3);
    }

    submod.reset = function () {
        setTimeout(function () {
            TRIPODS.game_state.block_coords.length = 0; // Reset block data
            TRIPODS.game_state.level_win = false;
            TRIPODS.game_state.tutorial_running = false;
            TRIPODS.game_state.moves_made.length = 0; // Empty array
            TRIPODS.game_state.element_tapped = "";

            Array.prototype.forEach.call(document.querySelectorAll(".layer"), function (el) {
                el.parentNode.removeChild(el);
            });

            submod.addUI();
        }, 120);
    }

    submod.showSuccessMessage = function () {
        setTimeout(function () {
            document.querySelector(".message h2 span").innerText = TRIPODS.game_state.moves_made.length; // Print number of moves
            const next_level = document.querySelector(".next-level");
            if (TRIPODS.game_state.level === TRIPODS.levels.length - 1 && next_level)
                next_level.parentNode.removeChild(next_level);

            TRIPODS.utils.fadeIn(".message");
        }, 500);
    }

    return submod;

}(TRIPODS || {}));

TRIPODS.level_builder = (function () {

    var submod = {};

    submod.runLevel = function () {
        TRIPODS.mvt.getMeasurements(); // Set UI measurements
        TRIPODS.mvt.calculatePivotState();
        TRIPODS.game_state.getWinCoords();
        TRIPODS.mvt.repositionPivot();

        if (!TRIPODS.game_state.initialised) TRIPODS.game_state.initialised = 1; // Set initialised flag

        const active_layer = document.getElementsByClassName("layer-active")[0];
        active_layer.style.opacity = 0.1;
        setTimeout(function () {
            active_layer.style.opacity = 1;
        }, 500);
    }

    submod.addUI = function () {
        TRIPODS.addElements(); // Add elements to grid
        TRIPODS.events.addEventListeners(); // Add event handlers

        document.querySelector('h2.level span').innerText = TRIPODS.game_state.level + 1; // Add level
        document.querySelector('h2.score span').innerText = TRIPODS.game_state.moves; // Add number of moves

        const last_layer = document.querySelector(".container > .layer:last-of-type");
        last_layer.classList.add("layer-active", "opacity-0"); // Add 'layer-active' class to top layer
        last_layer.style.display = "none";

        document.querySelector(".message").classList.add("hide");
        document.querySelector(".outer-container").classList.remove("opacity-0");

        setTimeout(function () {
            last_layer.style.display = "inherit";
            setTimeout(function() {
                last_layer.classList.remove("opacity-0");
                setTimeout(submod.runLevel, 500);
            }, 300);
        }, 3);
    }

    submod.reset = function () {

        document.querySelector(".outer-container").classList.add("opacity-0");

        setTimeout(function() {
            TRIPODS.game_state.moves = 0; // Reset move count
            TRIPODS.game_state.block_coords.length = 0; // Reset block data
            TRIPODS.game_state.level_win = 0;

            Array.prototype.forEach.call(document.querySelectorAll(".layer:not(.layer0)"), function (el) {
                el.parentNode.removeChild(el);
            });

            submod.addUI();
        }, 500);
    }

    submod.showSuccessMessage = function () {
        setTimeout(function () {
            document.querySelector(".message h2 span").innerText = TRIPODS.game_state.moves; // Print number of moves

            if (TRIPODS.game_state.level === TRIPODS.levels.length - 1) {
                const next_level = document.querySelector(".next-level");
                next_level.parentNode.removeChild(next_level);
            }
            document.querySelector(".message").style.display = "inherit";
        }, 500);
    }

    return submod;

}());

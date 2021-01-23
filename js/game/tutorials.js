TRIPODS.tutorials = (function (mod) {
    const submod = {
        levels: []
    };

    submod.levels[0] = ["#foot1", "#foot3", "#foot1", "#pivitor", "#foot3"]; // Level 1

    submod.placeTutorialElement = function () {

        const label = document.querySelector("#tap");
        const selector = submod.levels[mod.game_state.level][mod.game_state.moves_made.length];
        const element = document.querySelector(selector);

        if (mod.game_state.moves_made.length < submod.levels[mod.game_state.level].length) { // If number of moves made is fewer than number of moves in this level's tutorial

            // Position label
            const left = parseFloat(element.style.left) + (parseFloat(getComputedStyle(element)["width"]) - parseFloat(getComputedStyle(label)["width"])) / 2;
            // const top = parseFloat(element.style.top) - (parseFloat(getComputedStyle(element)["height"]) - parseFloat(getComputedStyle(label)["height"])) / 2;
            const top = parseFloat(element.style.top) - parseFloat(getComputedStyle(label)["height"]) * 0.3;

            label.style.left = `${left}px`;
            label.style.top = `${top}px`;

            document.getElementById("tap").style.opacity = 1; // Show tutorial label
        } else this.finish(); // Tutorial should now be complete
    }

    // Checks whether user is following the tutorial. Returns true or false
    submod.checkFollow = function () {

        if (!mod.game_state.moves_made.length) {
            console.error("mod.game_state.moves_made[] empty");
            return false;
        }

        const last_move = mod.game_state.moves_made[mod.game_state.moves_made.length - 1];
        const tutorial_step = submod.levels[mod.game_state.level][mod.game_state.moves_made.length - 1];

        return last_move === tutorial_step;
    }

    submod.finish = function () {

        mod.game_state.tutorial_running = false; // Tutorial should now be complete

        // Remove tutorial label
        TRIPODS.utils.fadeOut("#tap", function() {
            const label = document.querySelector("#tap");
            label.parentNode.removeChild(label);
        });
    }

    return submod;

}(TRIPODS || {}));

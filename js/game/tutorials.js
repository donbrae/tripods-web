TRIPODS.tutorials = (function (mod) {
    const submod = {
        levels: []
    };

    submod.levels[0] = ["#foot1", "#foot3", "#foot1", "#pivitor", "#foot3"]; // Level 1

    submod.placeTutorialElement = function () {

        if (mod.game_state.moves_made.length < submod.levels[mod.game_state.level].length) { // If number of moves made is fewer than number of moves in this level's tutorial

            const element = document.querySelector(submod.levels[mod.game_state.level][mod.game_state.moves_made.length]);
            const element_rect = element.getBoundingClientRect();

            const label = document.querySelector("#tap");
            const label_rect = label.getBoundingClientRect();

            const container = document.getElementById("container");
            const container_rect = container.getBoundingClientRect();

            // Position label
            const left = element_rect.x - container_rect.x - parseFloat(container.style.padding) + Math.abs(element_rect.width - label_rect.width) / 2;
            const top = element_rect.y - container_rect.y - parseFloat(container.style.padding) - label_rect.height * 0.3;

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
        TRIPODS.utils.fadeOut("#tap", function () {
            const label = document.querySelector("#tap");
            if (label) {
                label.parentNode.removeChild(label);
            }
        });
    }

    return submod;

}(TRIPODS || {}));

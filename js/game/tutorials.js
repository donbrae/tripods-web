TRIPODS.tutorials = (function (_module) {
    const _this = {
        levels: [],
        animate_tap: undefined // Instance of Web Animations API `Animation` constructor
    };

    _this.levels[0] = ["#foot1", "#foot3", "#foot1", "#pivotor", "#foot3"]; // Level 1
    _this.levels[1] = ["#pivotor", "#foot3", "#foot1", "#foot2", "#foot1", "#pivotor", "#pivotor", "#pivotor", "#foot1"]; // Level 2

    _this.placeTutorialElement = function () {

        if (_module.game_state.moves_made.length < _this.levels[_module.game_state.level].length) { // If number of moves made is fewer than number of moves in this level's tutorial
            if (_module.game_state.ignore_user_input) {
                return false;
            }

            const element = document.querySelector(_this.levels[_module.game_state.level][_module.game_state.moves_made.length]);
            const element_rect = element.getBoundingClientRect();

            const label = document.querySelector("#tap");
            const label_rect = label.getBoundingClientRect();

            const container = document.getElementById("container-grid");
            const container_rect = container.getBoundingClientRect();

            // Position label
            const left = element_rect.x - container_rect.x - parseFloat(container.style.padding) + Math.abs(element_rect.width - label_rect.width) / 2;
            const top = element_rect.y - container_rect.y - parseFloat(container.style.padding) - label_rect.height * 0.3;

            label.style.left = `${left}px`;
            label.style.top = `${top}px`;

            _module.utils.fadeIn("#tap"); // Show tutorial label

            const keyframes = [
                { transform: "translate(0,0)" },
                { transform: `translate(0,-${_module.ui_attributes.cell_dimensions / 8}px)` },
                { transform: "translate(0,0)" }
            ];

            _this.animate_tap = _module.utils.animate(document.getElementById("tap"), keyframes, { duration: 750, easing: "cubic-bezier(0.9, 1, 0.9, 1)", delay: 500, iterations: "Infinity" });

        } else {
            this.finish(); // Tutorial should now be complete
        }
    }

    // Checks whether user is following the tutorial. Returns true or false
    _this.checkFollow = function () {

        if (!_module.game_state.moves_made.length) {
            console.error("_module.game_state.moves_made[] empty");
            return false;
        }

        const last_move = _module.game_state.moves_made[_module.game_state.moves_made.length - 1];
        const tutorial_step = _this.levels[_module.game_state.level][_module.game_state.moves_made.length - 1];

        return last_move === tutorial_step;
    }

    _this.finish = function () {

        _module.game_state.tutorial_running = false; // Tutorial should now be complete, or the user has exited it

        // Remove tutorial label
        _module.utils.fadeOut("#tap", undefined, undefined, function () {
            const label = document.querySelector("#tap");
            if (label) {
                label.parentNode.removeChild(label);
            }
        });
    }

    return _this;

}(TRIPODS || {}));

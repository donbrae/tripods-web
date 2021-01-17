TRIPODS.events = (function () {

    const submod = {
        state: {
            // hold: 0
        }
    };

    submod.state.hold_interval = function () { };

    submod.addEventListeners = function () {

        if (!TRIPODS.game_state.initialised) {

            // Replay button
            const replay = document.querySelector('.replay');
            replay.addEventListener("touchend", TRIPODS.level_builder.reset, false);
            replay.addEventListener("click", TRIPODS.level_builder.reset, false);

            // 'Next level' button
            const next_level = document.querySelector('.next-level');
            function nextLevel() {
                TRIPODS.game_state.level++; // Increment level
                TRIPODS.level_builder.reset();
            }
            next_level.addEventListener("touchend", nextLevel, false);
            next_level.addEventListener("click", nextLevel, false);

            // // Changes to Hammer defaults
            // Hammer.gestures.Hold.defaults.hold_timeout = 600;
            // Hammer.gestures.Swipe.defaults.swipe_velocity = 0.1;

            // // Pivotor hold
            // $(document).hammer().on('hold', '.pivitor', function (e) {
            //     submod.state.hold = 1;
            //     submod.state.hold_interval = setInterval(function () { // Pivot automatically
            //         TRIPODS.mvt.pivot(e);
            //     }, 100);
            // });

            // // Pivot release during hold
            // $(document).hammer().on('release', '.pivitor', function (e) {
            //     setTimeout(function () {
            //         submod.state.hold = 0;
            //     }, 500); // Timeout for TRIPODS.info_panel.updateMoveCounter()

            //     clearInterval(submod.state.hold_interval);
            // });

            // // Prevent dragging on other elements
            // $(document).hammer().on('drag', '.container:not(.control), .outer-container, .message', function (e) {
            //     e.gesture.preventDefault();
            // });

            // Window resize
            window.addEventListener('resize', function () {
                TRIPODS.mvt.getMeasurements(); // Recalculate UI measurements on window resize
                TRIPODS.game_state.getWinCoords(); // Recalculate landing spot coords
            });
        }

        // Pivotor UI element
        const pivitor = document.querySelector('.pivitor');
        pivitor.addEventListener("touchend", TRIPODS.mvt.pivot, false); // Touch
        pivitor.addEventListener("click", TRIPODS.mvt.pivot, false); // Mouse pointer

        // Swipe
        const feet = document.querySelectorAll('.foot');
        Array.prototype.forEach.call(feet, function (foot) {
            foot.addEventListener("touchend", TRIPODS.mvt.swipe, false); // > Replace with swipe gesture for mobile
            foot.addEventListener("click", TRIPODS.mvt.swipe, false);
        });
    };

    return submod;

}());

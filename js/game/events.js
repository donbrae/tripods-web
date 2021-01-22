TRIPODS.events = (function () {

    "use strict";

    const submod = {
        state: {
            // hold: 0
        }
    };

    submod.state.hold_interval = function () { };

    submod.addEventListeners = function () {

        if (!TRIPODS.game_state.initialised) {

            let replay = document.querySelector('.replay'); // Replay button
            let next_level = document.querySelector('.next-level'); // 'Next level' button

            function nextLevel() {
                TRIPODS.game_state.level++; // Increment level
                console.log("LEVEL UP");
                TRIPODS.level_builder.reset();
            }

            if (navigator.maxTouchPoints) {
                replay.addEventListener("touchend", TRIPODS.level_builder.reset, false);
                next_level.addEventListener("touchend", nextLevel, false);
            } else {
                replay.addEventListener("click", TRIPODS.level_builder.reset, false);
                next_level.addEventListener("click", nextLevel, false);
            }

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
        const pivitor = document.getElementById('pivitor');
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

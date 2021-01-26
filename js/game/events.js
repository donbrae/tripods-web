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

            const start = document.querySelector('.start'); // Replay button
            const replay = document.querySelector('.replay'); // Replay button
            const next_level = document.querySelector('.next-level'); // 'Next level' button

            function buttonDisabledFalse(btn) {
                setTimeout(function () {
                    btn.disabled = false;
                }, 2000);
            }

            function nextLevel(e) {
                e.target.disabled = true;
                TRIPODS.game_state.level++; // Increment level
                TRIPODS.level_builder.reset();
                buttonDisabledFalse(e.target);
            }

            function launch(e) {
                e.target.disabled = true;
                TRIPODS.level_builder.addUI();
                buttonDisabledFalse(e.target);
            }

            function reset(e) {
                e.target.disabled = true;
                TRIPODS.level_builder.reset();
                buttonDisabledFalse(e.target);
            }

            console.log("merp");

            if (navigator.maxTouchPoints) {
                start.addEventListener("touchend", launch, false);
                replay.addEventListener("touchend", reset, false);
                next_level.addEventListener("touchend", nextLevel, false);
            } else {
                start.addEventListener("click", launch, false);
                replay.addEventListener("click", reset, false);
                next_level.addEventListener("click", nextLevel, false);
            }

            // Prevent double-tap-to-zoom (https://stackoverflow.com/a/38573198)
            let last_touch_end = 0;
            document.addEventListener("touchend", function (e) {
                const now = (new Date()).getTime();
                if (now - last_touch_end <= 300) {
                    e.preventDefault();
                }
                last_touch_end = now;
            }, false);

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

            TRIPODS.game_state.initialised = true; // Set initialised flag
        }

        // Pivotor UI element
        const pivitor = document.getElementById('pivitor');
        if (pivitor) {
            pivitor.addEventListener("touchend", TRIPODS.mvt.pivot, false); // Touch
            pivitor.addEventListener("click", TRIPODS.mvt.pivot, false); // Mouse pointer
        }

        // Swipe
        const feet = document.querySelectorAll('.foot');
        if (feet) {
            Array.prototype.forEach.call(feet, function (foot) {
                foot.addEventListener("touchend", TRIPODS.mvt.swipe, false); // > Replace with swipe gesture for mobile
                foot.addEventListener("click", TRIPODS.mvt.swipe, false);
            });
        }
    };

    return submod;

}());

TRIPODS.events = (function () {

    "use strict";

    const submod = {
        state: {
            shoogle_timeout: undefined
            // hold: 0
        }
    };

    submod.state.hold_interval = function () { };

    submod.addEventListeners = function () {

        if (!TRIPODS.game_state.initialised) {

            const start = document.querySelector('.start'); // Replay button
            const replay = document.querySelector('.replay'); // Replay button
            const next_level = document.querySelector('.next-level'); // 'Next level' button
            const hame = document.querySelectorAll('.hame'); // 'Back to hame screen' button

            function buttonDisabledFalse(btn) {
                setTimeout(function () {
                    btn.disabled = false;
                }, 2000);
            }

            function nextLevel(e) {
                e.target.disabled = true;
                TRIPODS.game_state.level++; // Increment level
                window.localStorage.setItem("TRIPODS_level", TRIPODS.game_state.level);
                TRIPODS.level_builder.reset(TRIPODS.level_builder.addUI);
                buttonDisabledFalse(e.target);
            }

            function launch(e) {

                const level_select = document.getElementById("level-select");

                if (level_select.value === "null") {

                    function shoogleLevelSelectField() {
                        level_select.classList.add("shoogle");
                        submod.state.shoogle_timeout = setTimeout(function () {
                            level_select.classList.remove("shoogle");
                        }, 830);
                    }

                    if (!navigator.maxTouchPoints) {
                        level_select.focus();
                    }
                    setTimeout(shoogleLevelSelectField, 200);

                    level_select.classList.remove("shoogle"); // Remove any previous shoogle
                    if (submod.state.shoogle_timeout !== undefined) clearTimeout(submod.state.shoogle_timeout); // Clear any previous shoogle timeout

                } else {
                    e.target.disabled = true;
                    TRIPODS.game_state.level = parseInt(level_select.value);
                    window.localStorage.setItem("TRIPODS_level", TRIPODS.game_state.level);
                    TRIPODS.level_builder.addUI();
                    buttonDisabledFalse(e.target);
                }
            }

            function reset(e) {
                e.target.disabled = true;
                TRIPODS.level_builder.reset(TRIPODS.level_builder.addUI);
                buttonDisabledFalse(e.target);
            }

            function gangHame(e) {
                e.target.disabled = true;
                TRIPODS.level_builder.reset(TRIPODS.addLevelSelect);
                TRIPODS.utils.fadeIn(".splash");
                buttonDisabledFalse(e.target);
            }

            if (navigator.maxTouchPoints) {
                start.addEventListener("touchend", launch, false);
                replay.addEventListener("touchend", reset, false);
                next_level.addEventListener("touchend", nextLevel, false);
                Array.prototype.forEach.call(hame, el => {
                    el.addEventListener("touchend", gangHame, false);
                });
            } else {
                start.addEventListener("click", launch, false);
                replay.addEventListener("click", reset, false);
                next_level.addEventListener("click", nextLevel, false);
                Array.prototype.forEach.call(hame, el => {
                    el.addEventListener("click", gangHame, false);
                });
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

            function resize() {
                TRIPODS.mvt.getMeasurements(); // Recalculate UI measurements on window resize
                TRIPODS.game_state.getWinCoords(); // Recalculate landing spot coords
                TRIPODS.game_state.getBlockerCoords(); // Recalculate blocker coords
            }

            // Window resize
            let resize_timeout = undefined;
            window.addEventListener("resize", () => {
                // console.log(resize_timeout);
                if (resize_timeout !== undefined) {
                    clearTimeout(resize_timeout);
                }

                resize_timeout = setTimeout(resize, 180);
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
                foot.addEventListener("touchend", TRIPODS.mvt.swipe, false);
                foot.addEventListener("click", TRIPODS.mvt.swipe, false);
            });
        }

        // Tutorial indicator
        const tap = document.getElementById('tap');
        if (tap) {
            tap.addEventListener("touchend", TRIPODS.tutorials.finish, false);
            tap.addEventListener("click", TRIPODS.tutorials.finish, false);
        }
    };

    return submod;

}());

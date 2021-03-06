TRIPODS.events = (function (_module) {

    "use strict";

    const _this = {
        state: {
            shoogle_timeout: undefined
            // hold: 0
        }
    };

    _this.state.hold_interval = function () { };

    _this.addEventListeners = function () {

        if (!_module.game_state.initialised) {

            const start = document.querySelectorAll('.start'); // Level button
            const replay = document.querySelectorAll('.replay'); // Replay button
            const next_level = document.querySelectorAll('.next-level'); // 'Next level' button
            const hame = document.querySelectorAll('.hame'); // 'Back to hame screen' button

            function buttonDisabledFalse(btn) {
                setTimeout(function () {
                    btn.disabled = false;
                }, 2000);
            }

            function nextLevel(e) {
                e.target.disabled = true;
                _module.game_state.level++; // Increment level
                window.localStorage.setItem("TRIPODS_level", _module.game_state.level);
                _module.level_builder.reset(_module.level_builder.addUI);
                buttonDisabledFalse(e.target);
                e.preventDefault();
            }

            function launch(e) {
                e.currentTarget.disabled = true;
                _module.game_state.level = parseInt(e.currentTarget.dataset.level);
                _module.utils.fadeOut(".screen-win", 1);
                _module.utils.fadeOut(".screen-lose", 1);

                window.localStorage.setItem("TRIPODS_level", _module.game_state.level);
                _module.level_builder.addUI();
                buttonDisabledFalse(e.currentTarget);
                e.preventDefault();
            }

            function reset(e) {
                e.target.disabled = true;
                _module.level_builder.reset(_module.level_builder.addUI);
                buttonDisabledFalse(e.target);
                e.preventDefault();
            }

            function gangHame(e) {
                e.target.disabled = true;
                _module.level_builder.reset(function () {
                    _module.addLevelSelect();
                    _module.utils.fadeOut(".screen-win", 180);
                    _module.utils.fadeOut(".screen-lose", 180);

                    setTimeout(() => {
                        _module.utils.fadeIn(".screen-level-select");
                    }, 180);
                });
                buttonDisabledFalse(e.target);
                e.preventDefault();
            }

            Array.prototype.forEach.call(replay, el => {
                el.addEventListener("click", reset, false);
            });
            Array.prototype.forEach.call(next_level, el => {
                el.addEventListener("click", nextLevel, false);
            });
            Array.prototype.forEach.call(hame, el => {
                el.addEventListener("click", gangHame, false);
            });
            Array.prototype.forEach.call(start, el => {
                el.addEventListener("click", launch, false);
            });
            // }

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
                _module.mvt.getMeasurements(); // Recalculate UI measurements on window resize
                _module.game_state.getWinCoords(); // Recalculate landing spot coords
                _module.game_state.getBlockerCoords(); // Recalculate blocker coords
                _module.game_state.getVortexCoords(); // Recalculate vortex coords
                _module.utils.handleOrientation();
            }

            // Window resize
            let resize_timeout = undefined;
            window.addEventListener("resize", () => {
                if (resize_timeout !== undefined) {
                    clearTimeout(resize_timeout);
                }

                resize_timeout = setTimeout(resize, 180);
            });

            _module.game_state.initialised = true; // Set initialised flag
        }

        // Pivotor UI element
        const pivitor = document.getElementById('pivitor');
        if (pivitor) {
            pivitor.addEventListener("touchend", _module.mvt.pivot, false); // Touch
            pivitor.addEventListener("click", _module.mvt.pivot, false); // Mouse pointer
        }

        // Swipe
        const feet = document.querySelectorAll('.foot');
        if (feet) {
            Array.prototype.forEach.call(feet, function (foot) {
                foot.addEventListener("touchend", _module.mvt.swipe, false);
                foot.addEventListener("click", _module.mvt.swipe, false);
            });
        }

        // Tutorial indicator
        // const tap = document.getElementById('tap');
        // if (tap) {
        //     tap.addEventListener("touchend", _module.tutorials.finish, false);
        //     tap.addEventListener("click", _module.tutorials.finish, false);
        // }
    };

    return _this;

}(TRIPODS || {}));

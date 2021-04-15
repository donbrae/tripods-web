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

                // Work around first-sound glitch
                Howler.volume(0.01);
                _module.sound.play("land");

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
                    _module.utils.fadeOut(".screen-privacy-policy", 180, true);
                    _module.utils.fadeOut(".screen-win", 180);
                    _module.utils.fadeOut(".screen-lose", 180);

                    Array.prototype.forEach.call(document.querySelectorAll("#level-buttons button.start"), button => {
                        button.classList.remove("highlight");
                    });

                    setTimeout(() => {
                        document.querySelectorAll("#level-buttons button.start")[_module.game_state.level].classList.add("highlight");
                        _module.utils.fadeIn(".screen-level-select", undefined, _module.utils.setLevelSelectGridHeight);
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

            document.getElementById("show-privacy-policy").addEventListener("click", (e) => {
                _module.utils.fadeOut(".screen-level-select", undefined, true, () => {
                    _module.utils.fadeIn(".screen-privacy-policy");
                });
                e.preventDefault();
            }, false);

            document.getElementById("sound").addEventListener("click", (e) => {
                _module.game_state.sound = !_module.game_state.sound;

                if (_module.game_state.sound) {
                    e.target.classList.add("sound-on");
                    e.target.classList.remove("sound-off");
                } else {
                    e.target.classList.add("sound-off");
                    e.target.classList.remove("sound-on");
                }
                window.localStorage.setItem("TRIPODS_sound", _module.game_state.sound);
            }, false);

            document.getElementById("guides").addEventListener("click", (e) => {
                _module.game_state.guides = !_module.game_state.guides;

                const pivotor = document.getElementById("pivotor");

                if (_module.game_state.guides) {
                    Array.prototype.forEach.call(document.querySelectorAll(".foot"), foot => {
                        foot.classList.remove("hide-guide");
                    });
                    pivotor.classList.remove("hide-guide");
                    e.target.classList.add("guides-on");
                    e.target.classList.remove("guides-off");
                } else {
                    Array.prototype.forEach.call(document.querySelectorAll(".foot"), foot => {
                        foot.classList.add("hide-guide");
                    });
                    pivotor.classList.add("hide-guide");
                    e.target.classList.add("guides-off");
                    e.target.classList.remove("guides-on");
                }
                window.localStorage.setItem("TRIPODS_guides", _module.game_state.guides);
            }, false);

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
                _module.utils.handleOrientation();
                _module.mvt.getMeasurements(); // Recalculate UI measurements on window resize
                _module.game_state.getWinCoords(); // Recalculate landing spot coords
                _module.game_state.getBlockerCoords(); // Recalculate blocker coords
                _module.game_state.getVortexCoords(); // Recalculate vortex coords
            }

            // Window resize
            let resize_timeout = undefined;
            window.addEventListener("resize", () => {
                if (resize_timeout !== undefined) {
                    clearTimeout(resize_timeout);
                }

                resize_timeout = setTimeout(resize, 120);
            });


            _module.game_state.initialised = true; // Set initialised flag
        }

        // Pivotor UI element
        const pivotor = document.getElementById('pivotor');
        if (pivotor) {
            pivotor.addEventListener("touchend", _module.mvt.pivot, false); // Touch
            pivotor.addEventListener("click", _module.mvt.pivot, false); // Mouse pointer
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

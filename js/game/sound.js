TRIPODS.sound = (function (_module) {

    "use strict";

    const _this = {};

    const folder = "./sound";
    const sounds = {}; // Howl objects

    _this.init = function () {
        sounds.block_collide_pivot = new Howl({
            src: [`${folder}/block-collide-pivot.webm`, `${folder}/block-collide-pivot.m4a`]
        });
        sounds.block_collide_jump = new Howl({
            src: [`${folder}/block-collide-jump.webm`, `${folder}/block-collide-jump.m4a`]
        });
        sounds.block_collide_boundary = new Howl({
            src: [`${folder}/block-collide-boundary.webm`, `${folder}/block-collide-boundary.m4a`]
        });
        sounds.win = new Howl({
            src: [`${folder}/win.webm`, `${folder}/win.m4a`]
        });
        sounds.land = new Howl({
            src: [`${folder}/land.webm`, `${folder}/land.m4a`]
        });
        sounds.vortex = new Howl({
            src: [`${folder}/vortex.webm`, `${folder}/vortex.m4a`]
        });
    };

    _this.play = function(sound, delay = 1) {

        if (!_module.game_state.sound) {
            return false;
        }

        setTimeout(() => {
            sounds[sound].play();
        }, delay);
    }

    return _this;

}(TRIPODS || {}));

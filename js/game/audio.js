TRIPODS.audio = (function (_module) {

    "use strict";

    const _this = {};

    const folder = "./audio";

    const sounds = { // Howl objects
        block_collide: undefined,
        win: undefined
    };

    _this.init = function () {
        sounds.block_collide = new Howl({
            src: [`${folder}/block-collide.webm`, `${folder}/block-collide.m4a`]
        });
        sounds.win = new Howl({
            src: [`${folder}/win.webm`, `${folder}/win.m4a`]
        });
    };

    _this.play = function(sound, delay = 1) {
        setTimeout(() => {
            sounds[sound].play();
        }, delay);
    }

    return _this;

}(TRIPODS || {}));

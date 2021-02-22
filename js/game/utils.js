TRIPODS.utils = (function () {

    "use strict";

    const submod = {};

    // Calculate distance between two points
    submod.getLineDistance = function (point1, point2) { // http://snipplr.com/view/47207/

        let xs = 0;
        let ys = 0;

        xs = point2.x - point1.x;
        xs = xs * xs;

        ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    // Get center point of element
    submod.getCenterPoint = function (el) {
        const el_rect = el.getBoundingClientRect();
        const center_x = el_rect.x + el_rect.width / 2;
        const center_y = el_rect.y + el_rect.height / 2;

        return { x: center_x, y: center_y };
    }

    // Calculate distance between two elements
    submod.getLineDistanceEl = function (obj1, obj2) {
        return this.getLineDistance(this.getCenterPoint(obj1), this.getCenterPoint(obj2));
    }

    // Calculate angle in degrees between two points
    submod.getAngle = function (x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    // Calculate angle in degrees between two elements
    submod.getAngleEl = function (obj1, obj2) {
        const obj1_coords = this.getCenterPoint(obj1);
        const obj2_coords = this.getCenterPoint(obj2);

        return this.getAngle(obj1_coords.x, obj1_coords.y, obj2_coords.x, obj2_coords.y);
    }

    // https://stackoverflow.com/a/64654744
    submod.getTranslateXY = function (element) {
        const style = window.getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return {
            tX: matrix.m41,
            tY: matrix.m42
        }
    }

    submod.extend = function (out) {
        out = out || {};

        for (let i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (let key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    }

    // JavaScript Web Animations API animate() abstraction
    submod.animate = function (element, keyframes, {
        duration = 1000,
        easing = "linear",
        delay = 0,
        iterations = 1,
        direction = "normal",
        fill = "forwards"
    }, callback = null) {

        const animation = element.animate(
            keyframes,
            {
                duration: duration,
                easing: easing,
                delay: delay,
                iterations: iterations,
                direction: direction,
                fill: fill
            }
        );

        if (typeof (callback) == "function") {
            animation.onfinish = callback;
        }

    }

    submod.fadeInNew = function(selector, callback) {
        const element = document.querySelector(selector);

        if (element) {
            TRIPODS.utils.animate(element, [
                { filter: getComputedStyle(element).filter },
                { filter: "opacity(1)" },
            ], { duration: 180 }, callback);
        }
    }

    submod.fadeOutNew = function(selector, callback) {
        const element = document.querySelector(selector);

        if (element) {
            TRIPODS.utils.animate(element, [
                { filter: getComputedStyle(element).filter },
                { filter: "opacity(0)" },
            ], { duration: 180 }, callback);
        }
    }

    submod.fadeIn = function (selector, callback) {
        const el = document.querySelector(selector);

        if (el) {
            el.classList.remove("hide");
            setTimeout(function () {
                el.classList.add("show");
                setTimeout(function () {
                    if (typeof (callback) == "function") callback();
                }, 310);
            }, 100); // Slight delay so the change in opacity works
        }
    }

    submod.fadeOut = function (selector, callback) {
        const el = document.querySelector(selector);

        if (el) {
            el.classList.remove("show");
            setTimeout(function () {
                el.classList.add("hide");
                if (typeof (callback) == "function") callback();
            }, 310);
        }
    }

    submod.log = function (msg) {
        if (navigator.maxTouchPoints) {
            // On mobile, most recent logs are at the top
            document.querySelector(".log").innerHTML = `${msg} [${Math.round((new Date()).getTime() / 1000)}]<br>${document.querySelector(".log").innerHTML}`;
        } else {
            console.log(msg);
        }
    }

    submod.is_iOS = function () {
        const user_agent = navigator.userAgent.toLowerCase();
        return user_agent.indexOf("iphone") > -1 ||
            user_agent.indexOf("ipod") > -1 ||
            user_agent.indexOf("ipad") > -1 || // This may not be required
            (navigator.maxTouchPoints && /Mac/.test(navigator.platform)); // iPad running 'desktop' Safari
    }

    return submod;

}());

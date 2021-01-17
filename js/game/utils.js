TRIPODS.utils = (function () {

    const submod = {};

    // Calculate distance between two points
    submod.getLineDistance = function (point1, point2) { // Credit: http://snipplr.com/view/47207/

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
        const offset = el.getBoundingClientRect();
        const center_x = offset.left + document.body.scrollLeft + parseFloat(getComputedStyle(el, null).width.replace("px", "")) / 2;
        const center_y = offset.top + document.body.scrollTop + parseFloat(getComputedStyle(el, null).height.replace("px", "")) / 2;

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

    submod.fadeIn = function (selector, callback) {
        document.querySelector(selector).classList.remove("hide");
        setTimeout(function () {
            document.querySelector(selector).classList.add("show");
            setTimeout(function () {
                if (typeof (callback) == "function") callback();
            }, 310);
        }, 100); // Slight delay so the change in opacity works
    }

    submod.fadeOut = function (selector, callback) {
        document.querySelector(selector).classList.remove("show");
        setTimeout(function () {
            document.querySelector(selector).classList.add("hide");
            if (typeof (callback) == "function") callback();
        }, 310);
    }

    return submod;

}());

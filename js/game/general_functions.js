TRIPODS.utils = (function () {

    var submod = {};

    // Calculate distance between two points
    submod.getLineDistance = function (point1, point2) { // Credit: http://snipplr.com/view/47207/

        var xs = 0,
            ys = 0;

        xs = point2.x - point1.x;
        xs = xs * xs;

        ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    // Get center point of element
    submod.getCenterPoint = function (el) {
        var offset = el.getBoundingClientRect(),
            center_x = offset.left + document.body.scrollLeft + parseFloat(getComputedStyle(el, null).width.replace("px", "")) / 2,
            center_y = offset.top + document.body.scrollTop + parseFloat(getComputedStyle(el, null).height.replace("px", "")) / 2;

        return { x: center_x, y: center_y };
    }

    // Calculate distance between two elements
    submod.getLineDistanceEl = function (obj1, obj2) {
        var center_point_1 = this.getCenterPoint(obj1),
            center_point_2 = this.getCenterPoint(obj2);

        return this.getLineDistance(center_point_1, center_point_2);
    }

    // Calculate angle in degrees between two points
    submod.getAngle = function (x1, y1, x2, y2) {
        var dx = x2 - x1,
            dy = y2 - y1;

        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    // Calculate angle in degrees between two elements
    submod.getAngleEl = function (obj1, obj2) {
        var obj1_coords = this.getCenterPoint(obj1),
            obj2_coords = this.getCenterPoint(obj2);

        return this.getAngle(obj1_coords.x, obj1_coords.y, obj2_coords.x, obj2_coords.y);
    }

    submod.extend = function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    }

    return submod;

}());

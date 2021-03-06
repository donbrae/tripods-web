TRIPODS.utils = (function (_module) {

    "use strict";

    const _this = {};

    // Calculate distance between two points
    _this.getLineDistance = function (point1, point2) { // http://snipplr.com/view/47207/

        let xs = 0;
        let ys = 0;

        xs = point2.x - point1.x;
        xs = xs * xs;

        ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    // Get center point of element
    _this.getCenterPoint = function (el) {
        const el_rect = el.getBoundingClientRect();
        const center_x = el_rect.x + el_rect.width / 2;
        const center_y = el_rect.y + el_rect.height / 2;

        return { x: center_x, y: center_y };
    }

    // Calculate distance between two elements
    _this.getLineDistanceEl = function (obj1, obj2) {
        return this.getLineDistance(this.getCenterPoint(obj1), this.getCenterPoint(obj2));
    }

    // Calculate angle in degrees between two points
    _this.getAngle = function (x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    // Calculate angle in degrees between two elements
    _this.getAngleEl = function (obj1, obj2) {
        const obj1_coords = this.getCenterPoint(obj1);
        const obj2_coords = this.getCenterPoint(obj2);

        return this.getAngle(obj1_coords.x, obj1_coords.y, obj2_coords.x, obj2_coords.y);
    }

    // Get X and Y shifts of element relative to where it was previously. For improved performance, movement of elements is animated via translate(x, y), rather that amending an elements absolute coords (see keyframes objects within mvt.js)
    // https://stackoverflow.com/a/64654744
    _this.getTranslateXY = function (element) {
        const style = window.getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return {
            tX: matrix.m41,
            tY: matrix.m42
        }
    }

    _this.extend = function (out) {
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
    _this.animate = function (element, keyframes, {
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

    /**
     * .hide should be set in CSS as `display: none;`. Used by fadeOut() to actually hide an element after its opacity has been set to 0
     * .opacity-0 should be set in CSS as `opacity: 0;`. Allows elements to be displayed, but invisible, in the UI before any JavaScript runs. For the purpose of, say, calculating object properties such as height and xy coordinates relative to the viewport
     */
    _this.fadeIn = function (selector, duration = 180, callback) {
        const element = document.querySelector(selector);

        if (element) {
            element.classList.remove("hide", "opacity-0");
            element.style.filter = "opacity(0)"; // Make sure the element isn't visible before fade in (i.e. if it's opacity is 1)
            _module.utils.animate(element, [
                { filter: getComputedStyle(element).filter },
                { filter: "opacity(1)" },
            ], { duration: duration }, callback);
        }
    }

    _this.fadeOut = function (selector, duration = 180, hide = false, callback) {
        const element = document.querySelector(selector);

        if (element) {
            _module.utils.animate(element, [
                { filter: getComputedStyle(element).filter },
                { filter: "opacity(0)" },
            ], { duration: duration }, () => {

                if (hide) {
                    element.classList.add("hide");
                }

                if (typeof (callback) == "function") {
                    callback();
                }
            });
        }
    }

    // Fade out and disable button with 'selector'
    _this.fadeOutAndDisable = function(selector) {
        _this.fadeOut(selector, 100, false);
        document.querySelector(selector).disabled = true;
    }

    _this.log = function (msg) {
        if (navigator.maxTouchPoints) {
            // On mobile, most recent logs are at the top
            document.querySelector(".log").innerHTML = `${msg} [${Math.round((new Date()).getTime() / 1000)}]<br>${document.querySelector(".log").innerHTML}`;
        } else {
            console.log(msg);
        }
    }

    _this.is_iOS = function () {
        const user_agent = navigator.userAgent.toLowerCase();
        return user_agent.indexOf("iphone") > -1 ||
            user_agent.indexOf("ipod") > -1 ||
            user_agent.indexOf("ipad") > -1 || // This may not be required
            (navigator.maxTouchPoints && /Mac/.test(navigator.platform)); // iPad running 'desktop' Safari
    }

    // When/if iOS supports `"orientation": "portrait"` in manifest file, we can remove this function
    _this.handleOrientation = function() {
        const landscape = window.innerHeight < window.innerWidth;
        const max_width_portrait = 1024; // Landscape is fine on touch-enabled devices with at least this width (e.g. iPads Pro)

        if (navigator.maxTouchPoints && landscape && window.innerWidth <= max_width_portrait) {
            _this.fadeIn(".screen-landscape", 80);
        } else if (navigator.maxTouchPoints) {
            _this.fadeOut(".screen-landscape", 80, true);
            _this.setLevelSelectGridHeight();
        }
    }

    _this.setLevelSelectGridHeight = function() {
        const level_buttons_container = document.getElementById("level-buttons");
        level_buttons_container.style.maxHeight = 0;
        level_buttons_container.style.maxHeight = `${window.innerHeight - level_buttons_container.getBoundingClientRect().y}px`; // Set level select grid max height
    }

    return _this;

}(TRIPODS || {}));

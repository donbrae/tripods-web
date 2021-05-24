# Tripods

A puzzle game.

© Copyright Jamie Smith, 2013–2021. All rights reserved.

## Local installation

`npm install`

## Build

`npm run build`

This runs `build.sh`.

Test locally at ./dist/index.html.

## Deployment to Netlify

1. `npm run build`
2. Commit to git

The publish directory on Netlify is `dist`.

The following post-processing is handled by Netlify on deployment:

* CSS: minification
* JS: bundling

## Audio

### Convert wav to m4a and webm

`ffmpeg -i "【clipboard】.wav" -codec:a aac -b:a 256k "【clipboard】.m4a" && ffmpeg -i "【clipboard】.wav" -b:a 80k "【clipboard】.webm"`

## Notes

* Possible more sophisticated motion blur effect: https://codepen.io/damianmuti/pen/MvYPPa.

### Safari ‘Tap’ label flicker

(Level 2.)

```javascript
var event = new Event('click');
var delay = 750;
document.getElementById("pivotor").dispatchEvent(event);

setTimeout(() => {
    document.getElementById("foot3").dispatchEvent(event);
}, delay);

setTimeout(() => {
    document.getElementById("foot1").dispatchEvent(event);
}, delay * 1.76);
```

Functions to test: hideTutorialLabel(), placeTutorialElement(). #tap fadeIn in latter is clashing with fadeOut(s) in the former. Maybe put #tap fadeIn() and tap_animate_vertical (NB. tap_animate_vertical itself has delay!) within a setTimeout() and cancel the setTimeout() (and optionally _module.tutorials.tap_animate_vertical?) in hideTutorialLabel()?

Or, maybe amend fadeIn() function to return animation object and assign that to a state variable (with slight delay) in placeTutorialElement() (see the fadeIn() call), which you can then cancel alongside tap_animate_vertical in hideTutorialLabel()?

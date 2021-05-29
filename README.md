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

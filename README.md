# Tripods

A puzzle game.

© Copyright Jamie Smith, 2013–present. All rights reserved.

# npm

The only npm dependency is Babel, which is used to transform template literals to standard JS concatenation for ES5 compliance.

The following post-processing is handled by Netlify on deployment:

* CSS: minification
* JS: bundling

## Local installation

`npm install` (for Babel only; see note above.)

Run/develop in the browser locally via the file system, or any web server, e.g. `php -S localhost:8080`.

## Build

`npm run build`

This runs `build.sh`.

Test locally at ./dist/index.html.

## Deployment to Netlify

1. `npm run build`
2. Commit to git

The publish directory on Netlify is `dist`.

## Audio

### Convert wav to m4a and webm

`ffmpeg -i "【clipboard】.wav" -codec:a aac -b:a 256k "【clipboard】.m4a" && ffmpeg -i "【clipboard】.wav" -b:a 80k "【clipboard】.webm"`

## Notes

* Possible more sophisticated motion blur effect: https://codepen.io/damianmuti/pen/MvYPPa.

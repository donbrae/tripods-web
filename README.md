# Tripods

A puzzle game.

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

* CSS: minify
* JS: bundle

## Notes

* Possible more sophisticated motion blur effect: https://codepen.io/damianmuti/pen/MvYPPa.
* https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

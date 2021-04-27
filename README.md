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

### `clipPath`

Example (source: https://alexwlchan.net/2021/03/inner-outer-strokes-svg/#drawing-an-inner-stroke-with-clipping):

```xml
<svg class="control foot" id="foot1" style="top: 79px; left: 487px; width: 148px; height: 148px;">
  <defs>
    <clipPath id="insideCircleOnly">
      <circle cx="74" cy="74" r="42.94736842105263"></circle>
    </clipPath>
  </defs>
  <circle fill="#eda8ce" stroke-width="21.25px" cx="74" cy="74" r="42.94736842105263" clip-path="url(#insideCircleOnly)"></circle>
</svg>
```

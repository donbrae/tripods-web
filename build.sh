#!/bin/bash
cp index.html dist
rm -r dist/css
rm -r dist/js
rm -r dist/sound
rm -r dist/fonts
rm -r dist/img
cp -r css dist
cp -r js dist
cp -r sound dist
cp -r fonts dist
cp -r img dist
babel dist/js/game/*.js -d dist/js/game
exit 0

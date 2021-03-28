#!/bin/bash
cp index.html dist
rm -r dist/css
rm -r dist/js
rm -r dist/sound
cp -r css dist
cp -r js dist
cp -r sound dist
babel dist/js/game/*.js -d dist/js/game
exit 0

#!/bin/bash
cp index.html dist
rm -r dist/css
rm -r dist/js
rm -r dist/audio
cp -r css dist
cp -r js dist
cp -r audio dist
babel dist/js/game/*.js -d dist/js/game
exit 0

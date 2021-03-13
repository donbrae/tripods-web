#!/bin/bash
cp index.html dist
rm -r dist/css
rm -r dist/js
cp -r css dist
cp -r js dist
babel dist/js/game/*.js -d dist/js/game
exit 0

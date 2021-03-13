#!/bin/bash
cp index.html dist
rm -r dist/css
rm -r dist/js
cp -r css dist
cp -r js dist
# cat js/game/init.js js/game/!(init.js)*.js > tripods.js
# cp tripods.js dist/js/game
# cp -r js/vendor dist/js
# rm tripods.js
# babel dist/js/game/*.js -d dist/js/game
exit 0

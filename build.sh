#!/bin/bash
shopt -s extglob
cp index.html dist
cp -r css dist
cp -r js dist
cp -r img dist
shopt -u extglob

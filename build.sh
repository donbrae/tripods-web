#!/bin/bash
shopt -s extglob
cp index.html build
cp -r css build
cp -r js build
cp -r img build
shopt -u extglob

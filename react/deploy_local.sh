#!/bin/bash
# get variable with current folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# create deploy/local folder if it doesn't exist
mkdir -p $DIR/deploy/local
rm -rf $DIR/deploy/local/*

# create build folder if it doesn't exist
mkdir -p $DIR/build
rm -rf $DIR/build/*


export PUBLIC_URL=http://beast/development/local/portfolio/react/deploy/local
$DIR/node_modules/.bin/react-scripts build

# update files in deploy/local folder from build 

cp -r $DIR/build/* $DIR/deploy/local
rm -rf $DIR/build/*

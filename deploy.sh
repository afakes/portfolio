#!/bin/bash

# get the path to the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# add, commit and push changes
git add .
git commit -m "deploy"
git push


# copy files to public_portfoliio directory
cp -r * ../public_portfolio/


# change to public_portfolio directory
cd ../public_portfolio

# add, commit and push changes
git add .
git commit -m "deploy"
git push

# change back to the original directory
cd $DIR

# recreate the text version
cd text
./create_text.py

# copy the text version to portfolio root as readme.txt
cp resume.txt ../readme.txt

# change back to the original directory
cd $DIR



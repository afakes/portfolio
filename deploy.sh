#!/bin/bash

# get the path to the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# copy data/resume.json to ../public_resume, then commit and push
cp data/resume.json ../public_resume/
cd ../public_resume
git add .
git commit -m "deploy"
git push
cd $DIR



# recreate the text version
cd text
./create.py

# copy the text version to portfolio root as readme.txt
cp resume.txt ../readme.txt
cat ../versions.txt resume.txt  > ../readme.txt

# change back to the original directory
cd $DIR



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

# we would like to copy vanilla to s3 root folder 
cd vanilla
./deploy_s3.sh
cd $DIR

# we would like to copy web_components to s3  folder 
cd web_components
./deploy_s3.sh
cd $DIR


# make this the last one as it also tell cloudfront to update
# change to react folder run deploy_s3 and return
cd react
./deploy_s3.sh
cd $DIR



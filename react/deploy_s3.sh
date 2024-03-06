#!/bin/bash
# get variable with current folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

./deploy_local.sh

# create build folder if it doesn't exist
mkdir -p $DIR/build
rm -rf $DIR/build/*

# create deploy/s3 folder if it doesn't exist
mkdir -p $DIR/deploy/s3
rm -rf $DIR/deploy/s3/*

# d2arov4idegf9h.cloudfront.net
PUBLIC_URL=https://adamfakes.com/react $DIR/node_modules/.bin/react-scripts build

cp -r $DIR/build/* $DIR/deploy/s3
rm -rf $DIR/build/*

# deploy to s3
aws s3 sync $DIR/deploy/s3 s3://adamfakes.com/react --delete --acl public-read

# invalidate cloudfront
aws cloudfront create-invalidation --distribution-id E3KQYE7K1YTIPL --paths "/react/*"



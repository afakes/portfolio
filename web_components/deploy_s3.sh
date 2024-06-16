#/bin/bash


# get variable with current folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# get list of files  in folder 

echo "Copying  to s3 root"
aws s3 sync  . s3://adamfakes.com/web_components --acl public-read --include "index.*"

aws cloudfront create-invalidation --distribution-id E3KQYE7K1YTIPL --paths "/*"
aws cloudfront create-invalidation --distribution-id E20CMRUG3YJNW8 --paths "/*"

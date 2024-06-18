#/bin/bash


# get variable with current folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# get list of files  in folder 

echo "Copying  to s3 root"
aws s3 sync  . s3://adamfakes.com/vanilla_ai --acl public-read 

# if environmental variable is set, then invalidate cloudfront cache
if [ -z "$INVALIDATE" ]
then
    echo "No invalidation requested"
else
    echo "Invalidating cloudfront cache"
    aws cloudfront create-invalidation --distribution-id E3KQYE7K1YTIPL --paths "/*"
    aws cloudfront create-invalidation --distribution-id E20CMRUG3YJNW8 --paths "/*"
fi

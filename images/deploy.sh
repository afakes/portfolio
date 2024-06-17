#/bin/bash

# get variable with current folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# loop thru images folder and copy to s3
for path in ../images/source/*
do
    echo "Resize $path for web"
    filename=$(basename -- "$path")

    # resize image to 50% of original size
    convert ../images/source/$filename -resize 30% ../images/$filename
    aws s3 cp ../images/$filename s3://adamfakes.com/images/$filename --acl public-read 
done

# if environmental variable is set, then invalidate cloudfront cache
if [ -z "$INVALIDATE" ]
then
    echo "No invalidation requested"
else
    echo "Invalidating cloudfront cache"
    aws cloudfront create-invalidation --distribution-id E3KQYE7K1YTIPL --paths "/*"
    aws cloudfront create-invalidation --distribution-id E20CMRUG3YJNW8 --paths "/*"
fi


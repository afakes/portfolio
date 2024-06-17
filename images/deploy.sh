#/bin/bash

# get variable with current folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# loop thru images folder and copy to s3
for file in ../images/source/*
do
    echo "Resize $file for web"

    # resize image to 50% of original size
    convert $file -resize 50% ../images/$file

    # echo "Copying $file to s3"
    #  aws s3 cp $file s3://adamfakes.com/images/ --acl public-read 
done


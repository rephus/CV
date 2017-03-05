#!/bin/bash
md="cv.md"
html="public/cv.html"

echo "Looking for changes in $md"

while true
do
    mdUpdated=`date -d "now - $(date -r $md +%s) seconds" +%s`
    htmlUpdated=`date -d "now - $(date -r $html +%s) seconds" +%s`

    #Check update times
    #Update html if htmlUpdated is greater than mdUpdated
    if [ "$htmlUpdated" -gt "$mdUpdated" ]
    then
        ./convert.sh
        htmlUpdated=`date +%s` #now
    fi
    sleep 1
done

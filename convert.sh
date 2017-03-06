#!/bin/bash

file="cv"
echo "Converting markdown to HTML"
pandoc "$file.md" -f markdown -t html -s -o "public/$file.html"
echo "Converting markdown to ODT"
pandoc "$file.md" -f markdown -t odt -s -o "public/$file.odt"
echo "Converting markdown to PDF"
libreoffice --headless --convert-to pdf "public/$file.odt" > /dev/null
mv cv.pdf public/cv.pdf
echo "Converting markdown to JSON"
node markdown.js cv.md public/cv.json

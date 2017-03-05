#!/bin/bash

file="cv"
echo "Converting markdown $cv"
pandoc "$file.md" -f markdown -t html -s -o "public/$file.html"
pandoc "$file.md" -f markdown -t odt -s -o "public/$file.odt"
libreoffice --headless --convert-to pdf "public/$file.odt"
mv cv.pdf public/cv.pdf
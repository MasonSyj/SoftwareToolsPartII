#!/bin/bash

if [ "$#" == "1" ]
then
   git add -A
   git commit -m "${1}"
   git push
fi

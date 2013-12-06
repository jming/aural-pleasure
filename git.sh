#!/bin/bash
git add --all
git commit -m "$1"
git pull origin master
git push origin master
git pull heroku master
git push heroku master

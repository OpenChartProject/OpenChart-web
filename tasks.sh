#!/bin/bash

set -e

cd ${0%/*}
script=$0

case "$1" in
build)
    # Make the dist/ dir if it doesn't exist, otherwise clean it
    if [[ ! -d "dist/" ]]; then
        mkdir dist/
    else
        rm -rf dist/*
    fi

    yarn run build
    docker build -f docker/Dockerfile.nginx -t openchart/nginx .
    ;;

check)
    yarn format-check && yarn lint && yarn test
    ;;

start)
    docker run --rm -p "8000:80" openchart/nginx
    ;;
esac

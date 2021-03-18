#!/bin/bash

set -e

cd ${0%/*}
script=$0

function make_dist_dir() {
    if [[ ! -d "dist/" ]]; then
        mkdir dist/
    else
        rm -rf dist/*
    fi
}

case "$1" in
build)
    make_dist_dir
    yarn run build
    docker build \
        -f docker/Dockerfile.nginx \
        -t openchart/nginx \
        .
    ;;

check)
    yarn format-check
    yarn lint
    yarn test
    ;;

watch)
    make_dist_dir
    container=$(docker run \
        --rm \
        -d \
        -p "8000:80" \
        -p "8001:8001" \
        -v "$(pwd)/dist/:/usr/share/nginx/html/" \
        -v "$(pwd)/client/img/:/usr/share/nginx/html/img/" \
        nginx)

    yarn watch &
    trap "docker kill $container && kill 0" SIGINT
    wait
    ;;

start)
    docker run --rm -p "8000:80" openchart/nginx
    ;;
esac

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
    yarn build

    # Add a comment at the top of index.html with the commit and date
    commit=$(git show -s --oneline | cut -f 1 -d ' ')
    cur_date=$(date -Iseconds -u | cut -f 1 -d '+' | sed 's/T/ /')
    sed -i "1i <!-- $commit | $cur_date -->" dist/index.html

    # Build the nginx image
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
        -v "$(pwd)/client/img/noteskins/:/usr/share/nginx/html/noteskins/" \
        nginx)

    yarn watch &
    trap "docker kill $container && kill 0" SIGINT
    wait
    ;;
esac

#!/bin/sh

set -e

cd ${0%/*}
script=$0

fnBuildParcel() {
    docker build -f docker/Dockerfile.parcel -t openchart/parcel .
}

case "$1" in
build)
    # Make the dist/ dir if it doesn't exist, otherwise clean it
    if [[ ! -d "dist/" ]]; then
        mkdir dist/
    else
        rm -rf dist/*
    fi

    fnBuildParcel

    # Build and copy assets to dist/
    docker run --rm -v $(pwd)/dist/:/home/node/dist/ openchart/parcel yarn run build
    ;;

check)
    fnBuildParcel

    # Check the formatting, linting, and test suite
    docker run -t --rm openchart/parcel /bin/sh -c "yarn format-check && yarn lint && yarn test"
    ;;
esac

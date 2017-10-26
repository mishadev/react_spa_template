#!/bin/bash

APP_NAME=inbrowser
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="$( cd "$DIR/$APP_NAME" && pwd )"
CONTAINER_NAME="lux-sky-inbrowser-ui"
IMAGE_NAME="lux-sky-inbrowser-ui"
DOCKERFILE="Dockerfile"

docker rm -f $CONTAINER_NAME
docker rmi -f $IMAGE_NAME
echo =============================================================
echo build image $IMAGE_NAME form file ${BUILD_DIR}/${DOCKERFILE}
echo =============================================================
cd $BUILD_DIR
docker build -t $IMAGE_NAME --file="${DOCKERFILE}" .


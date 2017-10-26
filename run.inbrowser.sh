#!/bin/bash

APP_NAME=inbrowser
# BUILDER_OUTPUT_DIR_PATH="../git_static/"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="$( cd "$DIR/$APP_NAME" && pwd )"
CONTAINER_NAME="lux-sky-inbrowser-ui"
IMAGE_NAME="lux-sky-inbrowser-ui"

if [ -z $BUILDER_OUTPUT_DIR_PATH ]; then
  BUILDER_OUTPUT_DIR_PATH="../webstatic/www"
  mkdir -p "$DIR/$BUILDER_OUTPUT_DIR_PATH"
  OUTPUT="$( cd "$DIR/$BUILDER_OUTPUT_DIR_PATH" && pwd )"
else
  mkdir -p "$BUILDER_OUTPUT_DIR_PATH"
  OUTPUT="$( cd "$BUILDER_OUTPUT_DIR_PATH" && pwd )"
fi
echo =============================================================
echo run image $IMAGE_NAME container name $CONTAINER_NAME
echo build $BUILD_DIR
echo output to $OUTPUT
echo =============================================================
if [[ ${1} == dev ]]; then

  docker rm -f $CONTAINER_NAME
  docker run -it \
    --env-file="$DIR/secrets_dev" \
    -v "$BUILD_DIR/src:/app/src" \
    -v "$BUILD_DIR/build:/app/build" \
    -v "$BUILD_DIR/static:/app/static" \
    -v "$BUILD_DIR/.babelrc:/app/.babelrc" \
    -v "$BUILD_DIR/.eslintrc.json:/app/.eslintrc.json" \
    -v "$BUILD_DIR/package.json:/app/package.json" \
    -v "$OUTPUT:/app/output" \
    -p 80:80 \
    -e "OUTPUT=/app/output" \
    --name $CONTAINER_NAME \
    $IMAGE_NAME npm run build:dev
  # $IMAGE_NAME bash

else

  sudo docker rm -f $CONTAINER_NAME
  sudo docker run -it \
    --env-file="$DIR/secrets_prod" \
    -v "$BUILD_DIR/src:/app/src" \
    -v "$OUTPUT:/app/output" \
    -e "OUTPUT=/app/output" \
    --name $CONTAINER_NAME \
    $IMAGE_NAME

fi


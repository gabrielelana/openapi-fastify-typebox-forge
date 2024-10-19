#!/bin/bash

set -eux

WORKING_DIR=$(dirname "$0")

for FILE in "$WORKING_DIR"/*.json; do
    NAME=$(basename "$FILE" .json)
    pnpm run exec:dev -i "$FILE" -o "$WORKING_DIR/$NAME"
done

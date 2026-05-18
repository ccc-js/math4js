#!/bin/bash
set -x

cd "$(dirname "$0")"

npm install

npm run lint

npm run test
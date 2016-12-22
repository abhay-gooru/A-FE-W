#!/bin/bash
##
## Description:
##
## This script invoques the actual build script
## inside a docker container
##
## Author: Julio Arias <julio.arias@edify.cr>

source .ci/common.sh

if [ -z "$S3_BUCKET" ]; then
  error "No S3 bucket specified."
  exit 1
fi

if [[ -z "$AWS_ACCESS_KEY_ID" ]] || [[ -z "$AWS_SECRET_ACCESS_KEY" ]] || [[ -z "$AWS_DEFAULT_REGION" ]]; then
  error "No AWS credentials provided."
  exit 1
fi

info "Downloading welcome site..."
silent aws s3 cp s3://${S3_BUCKET}/frontend-30/welcome/welcome.tar.gz .

info "Running build inside node:4.6 docker image..."

docker kill builder
docker rm builder
docker run -t \
  --rm \
  --name builder \
  -v ${PWD}:/build \
  -e bamboo_buildNumber=${bamboo_buildNumber} \
  -e bamboo_repository_branch_name=${bamboo_repository_branch_name} \
  -w /build \
  node:4.6 .ci/build.sh
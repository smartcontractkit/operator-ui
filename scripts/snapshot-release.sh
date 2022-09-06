#!/bin/bash
set -e
# Publish snapshot releases to github packages
# This script accepts the following environment variables:
# GH_TOKEN A github issued token that has permissions to push to the github packages registry
export CI=true

gitRoot=$(git rev-parse --show-toplevel)
cd "$gitRoot" >/dev/null || exit 1

# Setup project

# Update package version with snapshot
yarn changeset version --snapshot

# Create .npmrc for publishing
echo '//npm.pkg.github.com/:_authToken=${GH_TOKEN}' >.npmrc
echo '@smartcontractkit:registry=https://npm.pkg.github.com/' >>.npmrc

yarn changeset publish --no-git-tag --snapshot

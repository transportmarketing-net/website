#!/bin/bash
# Deploy greenpromo to Forge production
# Target: forge@64.227.66.233:/home/forge/greenpromo.transportmarketing.net/public_html/
#
# IMPORTANT: Always deploy into public_html/ subdirectory.
# Nginx root is /home/forge/greenpromo.transportmarketing.net/public_html
# Never rsync to the parent directory or use --delete at the parent level.

set -euo pipefail

REMOTE="forge@64.227.66.233"
REMOTE_PATH="/home/forge/greenpromo.transportmarketing.net/public_html/"
LOCAL_PATH="$(cd "$(dirname "$0")" && pwd)/"

echo "Deploying greenpromo to production..."
echo "  From: $LOCAL_PATH"
echo "  To:   $REMOTE:$REMOTE_PATH"

rsync -avz --delete \
  --exclude='.git' \
  --exclude='deploy.sh' \
  --exclude='*.md' \
  "$LOCAL_PATH" "$REMOTE:$REMOTE_PATH"

echo ""
echo "Deploy complete. Verifying..."
STATUS=$(curl -sI https://greenpromo.transportmarketing.net/ | head -1)
echo "  $STATUS"

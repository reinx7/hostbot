#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
rm -f ../hostbot.zip
zip -r ../hostbot.zip . -x "node_modules/*" ".next/*" "storage/*" ".env"
echo "ZIP criado em ../hostbot.zip"

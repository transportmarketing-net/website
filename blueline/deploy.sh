#!/usr/bin/env bash
set -euo pipefail
brand_dir="$(cd "$(dirname "$0")" && pwd)"
remote="forge@64.227.66.233"
document_root="/home/forge/blueline.transportmarketing.net/public_html"
release_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_dir="/home/forge/blueline.transportmarketing.net/backups/$release_stamp"
python3 "$brand_dir/build-release.py"
manifest_list="$(mktemp)"
trap 'rm -f "$manifest_list"' EXIT
python3 - "$brand_dir/release-manifest.json" "$manifest_list" <<'PY'
import json,sys
from pathlib import Path
manifest=json.loads(Path(sys.argv[1]).read_text())
Path(sys.argv[2]).write_text('\n'.join(manifest['files']+['release-manifest.json'])+'\n')
PY
ssh "$remote" "test -d '$document_root' && mkdir -p '$backup_dir'"
rsync -az --delay-updates --backup --backup-dir="$backup_dir" \
  --files-from="$manifest_list" "$brand_dir/" "$remote:$document_root/"
printf 'BlueLine deployed. Rollback files: %s:%s\n' "$remote" "$backup_dir"

#!/usr/bin/env bash
set -euo pipefail
site_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "${site_root}/scripts/serve-local.py" "${1:-8045}"

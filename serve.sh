#!/usr/bin/env bash
# Browse the catalog in your browser. Regenerates the data, then serves locally.
#   ./serve.sh [port]        (default 8099)
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")"
PORT="${1:-8099}"
python3 web/gen.py
echo
echo "  CTF Catalog:  http://localhost:${PORT}/web/"
echo "  (Ctrl-C to stop)"
echo
exec python3 -m http.server "$PORT" --bind 127.0.0.1

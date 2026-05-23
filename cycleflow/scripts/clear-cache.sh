#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

removed=()

rm_path() {
  if [[ -e "$1" ]]; then
    rm -rf "$1"
    removed+=("$1")
  fi
}

rm_path node_modules/.vite
rm_path dist
rm_path dev-dist
rm_path .eslintcache

if [[ "${#removed[@]}" -eq 0 ]]; then
  echo "CycleFlow cache already clear (no .vite, dist, dev-dist, or .eslintcache)."
else
  echo "CycleFlow cache cleared:"
  printf '  - %s\n' "${removed[@]}"
fi

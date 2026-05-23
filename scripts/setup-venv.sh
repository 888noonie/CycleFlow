#!/usr/bin/env bash
# Create .venv on Pop!_OS / Ubuntu (needs python3-venv) or via uv fallback.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

if [[ -d .venv ]]; then
  echo ".venv already exists at ${ROOT}/.venv"
else
  if python3 -m venv .venv 2>/dev/null; then
    echo "Created .venv with python3 -m venv"
  elif command -v uv >/dev/null 2>&1; then
    uv venv .venv
    echo "Created .venv with uv (install python3-venv for stdlib venv: apt install python3.12-venv)"
  else
    echo "ERROR: need python3-venv (sudo apt install python3.12-venv) or uv on PATH."
    exit 1
  fi
fi

if command -v uv >/dev/null 2>&1; then
  uv pip install -r requirements-dev.txt --python .venv/bin/python
else
  .venv/bin/pip install -U pip
  .venv/bin/pip install -r requirements-dev.txt
fi

echo "Done. Activate: source .venv/bin/activate"

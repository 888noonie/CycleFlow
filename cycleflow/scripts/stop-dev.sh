#!/usr/bin/env bash
set -euo pipefail

PORT="${DEV_PORT:-5173}"
stopped=0

if command -v fuser >/dev/null 2>&1; then
  if fuser "${PORT}/tcp" >/dev/null 2>&1; then
    fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
    stopped=1
  fi
elif command -v lsof >/dev/null 2>&1; then
  pids="$(lsof -ti:"${PORT}" 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    kill ${pids} 2>/dev/null || kill -9 ${pids} 2>/dev/null || true
    stopped=1
  fi
fi

if [[ "${stopped}" -eq 1 ]]; then
  echo "CycleFlow dev server stopped (port ${PORT})."
else
  echo "No dev server found on port ${PORT}."
fi

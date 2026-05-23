#!/usr/bin/env python3
"""CycleFlow repo health checks: JSON validation, Python lint, npm lint + build."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CYCLEFLOW = ROOT / "cycleflow"
SCRIPTS = ROOT / "scripts"


def run(cmd: list[str], *, cwd: Path | None = None) -> int:
    label = " ".join(cmd)
    where = f" (cwd={cwd})" if cwd else ""
    print(f"\n→ {label}{where}\n")
    result = subprocess.run(cmd, cwd=cwd)
    return result.returncode


def check_json_files() -> list[str]:
    errors: list[str] = []
    candidates = sorted(ROOT.glob("*.json"))
    if not candidates:
        print("No root-level *.json files to validate.")
        return errors

    print("JSON validation (repo root)")
    for path in candidates:
        try:
            json.loads(path.read_text(encoding="utf-8"))
            print(f"  OK   {path.name}")
        except json.JSONDecodeError as exc:
            msg = f"{path.name}: {exc}"
            errors.append(msg)
            print(f"  FAIL {msg}")
    return errors


def check_python() -> int:
    py_files = sorted(SCRIPTS.glob("*.py"))
    if not py_files:
        return 0
    return run([sys.executable, "-m", "ruff", "check", str(SCRIPTS)])


def ensure_npm_deps() -> int:
    if (CYCLEFLOW / "node_modules").is_dir():
        return 0
    print("node_modules missing — running npm install in cycleflow/")
    return run(["npm", "install"], cwd=CYCLEFLOW)


def check_cycleflow_app() -> int:
    if not CYCLEFLOW.is_dir():
        print(f"ERROR: missing app directory: {CYCLEFLOW}")
        return 1

    code = ensure_npm_deps()
    if code != 0:
        return code

    for script in ("lint", "build"):
        code = run(["npm", "run", script], cwd=CYCLEFLOW)
        if code != 0:
            return code
    return 0


def main() -> int:
    print(f"CycleFlow check — root: {ROOT}\n")

    json_errors = check_json_files()
    exit_code = 1 if json_errors else 0

    exit_code = max(exit_code, check_python())
    exit_code = max(exit_code, check_cycleflow_app())

    print()
    if exit_code == 0:
        print("All checks passed.")
    else:
        print("Checks failed — see output above.", file=sys.stderr)
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())

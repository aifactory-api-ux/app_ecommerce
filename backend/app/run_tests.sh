#!/bin/bash
set -eo pipefail
cd "$(dirname "$0")"
echo ">>> [backend] Installing Python test dependencies..."
pip install --quiet pytest pytest-asyncio httpx fakeredis aiosqlite sqlalchemy 2>/dev/null || true
echo ">>> [backend] Running tests..."
python -m pytest app/tests/ -v 2>&1 | tee /tmp/test_out_backend.txt
EXIT_CODE=${PIPESTATUS[0]}
echo ">>> [backend] Done."
exit $EXIT_CODE
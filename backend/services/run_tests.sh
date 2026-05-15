#!/bin/bash
set -eo pipefail
cd "$(dirname "$0")"
echo ">>> [backend/services] Installing Python test dependencies..."
pip install pytest pytest-cov pytest-asyncio httpx anyio aiosqlite fastapi sqlalchemy pyjwt passlib bcrypt python-multipart -q 2>/dev/null || true
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt -q 2>/dev/null || true
fi
if [ -f "requirements-dev.txt" ]; then
    pip install -r requirements-dev.txt -q 2>/dev/null || true
fi
echo ">>> [backend/services] Running tests..."
export DATABASE_URL="sqlite+aiosqlite:///:memory:"
export ASYNC_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export DB_URL="sqlite:///:memory:"
export TEST_DATABASE_URL="sqlite+aiosqlite:///:memory:"
export SECRET_KEY="test-secret-key"
export JWT_SECRET="test-secret-key"
export PYTHONPATH="$(pwd):$(dirname $(pwd)):$(dirname $(dirname $(pwd))):${PYTHONPATH:-}"
mkdir -p coverage
python -m pytest tests/ --tb=short -q \
  --cov=. --cov-report=term-missing \
  --cov-report=json:coverage/coverage.json \
  --no-header 2>&1 | tee /tmp/test_out_backend_services.txt
EXIT_CODE=${PIPESTATUS[0]}
echo ">>> [backend/services] Done."
exit $EXIT_CODE
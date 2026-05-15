#!/bin/bash
set -eo pipefail
cd "$(dirname "$0")"
echo ">>> [frontend] Installing JS test dependencies..."
npm install --silent 2>/dev/null || true
npm install -D vitest @vitest/coverage-v8 vite jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event --silent 2>/dev/null || true
echo ">>> [frontend] Running tests..."
npx vitest run --coverage 2>&1 | tee /tmp/test_out_frontend.txt
EXIT_CODE=${PIPESTATUS[0]}
echo ">>> [frontend] Done."
exit $EXIT_CODE

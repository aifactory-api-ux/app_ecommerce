#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> [frontend] Installing JS test dependencies..."
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom --silent 2>/dev/null || true
echo ">>> [frontend] Running tests..."
npx vitest run --coverage 2>&1 | tee /tmp/test_out_frontend.txt
echo ">>> [frontend] Done."

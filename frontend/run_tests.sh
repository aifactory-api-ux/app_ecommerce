#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Running frontend tests..."
npm test -- --run
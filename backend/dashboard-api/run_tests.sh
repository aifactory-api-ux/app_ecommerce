#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Running dashboard-api tests..."
pytest tests/ -v --tb=short
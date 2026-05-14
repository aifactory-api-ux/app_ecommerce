#!/bin/bash
set -e

cd /app
python -m pytest tests/ -v --tb=short
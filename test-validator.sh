#!/bin/bash

# Local testing script for tech events validator
# Run this from your repo root: bash test-validator.sh

echo "🧪 Starting local validation test..."

# Create a temporary test directory
TEST_DIR=$(mktemp -d)
trap "rm -rf $TEST_DIR" EXIT

# Get the list of changed files (or use specific files for testing)
# For testing, you can manually specify files to test
if [ -z "$1" ]; then
  echo "Usage: bash test-validator.sh <path-to-json-file>"
  echo "Example: bash test-validator.sh data/events/myevent.json"
  echo ""
  echo "Or test multiple files by creating changed_files.txt:"
  echo "  echo 'events/conferences/event1.json' > changed_files.txt"
  echo "  echo 'events/conferences/event2.json' >> changed_files.txt"
  echo "  bash test-validator.sh"
  exit 1
fi

# If argument provided, create changed_files.txt
if [ ! -z "$1" ]; then
  echo "$1" > changed_files.txt
fi

# Run the validation script
echo ""
echo "Running validation script..."
node .github/scripts/validate-events.js

# Check if validation passed
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All tests passed!"
else
  echo ""
  echo "❌ Validation failed. Check validation-errors.txt for details:"
  echo ""
  cat validation-errors.txt
  exit 1
fi
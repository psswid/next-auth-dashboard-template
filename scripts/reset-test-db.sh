#!/usr/bin/env bash
set -euo pipefail

# Reset the test database to a clean state using prisma migrate reset
# Expects TEST_DATABASE_URL to be set. Defaults to local test DB on port 5433.
TEST_DATABASE_URL=${TEST_DATABASE_URL:-"postgresql://postgres:postgres@localhost:5433/app_db"}

export DATABASE_URL="$TEST_DATABASE_URL"

echo "Resetting test DB at $TEST_DATABASE_URL"

# Use npx so we don't require a global prisma install
npx prisma migrate reset --force --skip-generate

echo "Test DB reset complete"

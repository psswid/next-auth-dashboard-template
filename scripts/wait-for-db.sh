#!/usr/bin/env bash
set -euo pipefail

# Wait for TCP port to accept connections (bash /dev/tcp)
HOST=${PGHOST:-localhost}
PORT=${PGPORT:-5432}
TIMEOUT=${TIMEOUT:-60}

echo "Waiting for Postgres at $HOST:$PORT (timeout ${TIMEOUT}s)"
start=$(date +%s)
while true; do
  if bash -c "</dev/tcp/$HOST/$PORT" 2>/dev/null; then
    echo "Postgres is accepting connections"
    exit 0
  fi
  now=$(date +%s)
  if [ $((now - start)) -ge "$TIMEOUT" ]; then
    echo "Timed out waiting for Postgres at $HOST:$PORT"
    exit 1
  fi
  sleep 1
done

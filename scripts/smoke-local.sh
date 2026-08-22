#!/usr/bin/env bash
# Local self-host smoke: infra + optional CI gate + API /health.
# Usage: ./scripts/smoke-local.sh [--full]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FULL=false
if [[ "${1:-}" == "--full" ]]; then
  FULL=true
fi

echo "== infra (postgres:5435, redis:6379) =="
if command -v podman >/dev/null 2>&1; then
  podman compose ps --format json 2>/dev/null | grep -q '"State":"running"' || {
    echo "Starting compose…"
    podman compose up -d
    sleep 3
  }
else
  echo "warn: podman not found; assuming Postgres/Redis already up"
fi

if command -v pg_isready >/dev/null 2>&1; then
  pg_isready -h 127.0.0.1 -p 5435 -U getpersona -d getpersona
elif command -v podman >/dev/null 2>&1; then
  podman compose exec -T postgres pg_isready -U getpersona -d getpersona
fi

if command -v redis-cli >/dev/null 2>&1; then
  redis-cli -h 127.0.0.1 -p 6379 ping | grep -q PONG
fi

if [[ "$FULL" == true ]]; then
  echo "== turbo build typecheck test =="
  pnpm turbo run build typecheck test
fi

if [[ ! -f .env ]]; then
  echo "error: .env missing (copy from .env.example)" >&2
  exit 1
fi

echo "== API /health =="
set -a
# shellcheck disable=SC1091
source .env
set +a

API_PORT="${SMOKE_API_PORT:-3099}"
LOG="/tmp/getpersona-smoke-api.log"
PIDFILE="/tmp/getpersona-smoke-api.pid"

pnpm --filter @getpersona/api build >/dev/null

API_PORT="$API_PORT" node apps/api/dist/main.js >"$LOG" 2>&1 &
echo $! >"$PIDFILE"
trap 'kill "$(cat "$PIDFILE")" 2>/dev/null || true; rm -f "$PIDFILE"' EXIT

for _ in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${API_PORT}/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

curl -sf "http://127.0.0.1:${API_PORT}/health"
echo
HTTP_DOCS=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${API_PORT}/docs")
echo "GET /docs → ${HTTP_DOCS}"
[[ "$HTTP_DOCS" == "200" || "$HTTP_DOCS" == "301" || "$HTTP_DOCS" == "302" ]] || {
  echo "error: /docs not reachable" >&2
  exit 1
}

echo "== smoke ok =="

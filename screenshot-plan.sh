#!/usr/bin/env bash
# Capture desktop + mobile screenshots of EliteHuman.
# Requires: a server on :5173 (or set BASE_URL). Uses a headless Chrome already
# on the system (or CHROME env) — no puppeteer dependency, no placeholder files.
# Captures with prefers-reduced-motion forced, so entrance animations are at
# their settled state rather than caught mid-wipe at t=0 as invisible elements.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="${BASE_URL:-http://localhost:5173/EliteHuman}"
OUT_DIR="$ROOT/screenshots"
mkdir -p "$OUT_DIR"

find_chrome() {
  if [ -n "${CHROME:-}" ] && [ -x "$CHROME" ]; then echo "$CHROME"; return; fi
  for c in google-chrome-stable google-chrome chromium chromium-browser \
           microsoft-edge microsoft-edge-stable; do
    if command -v "$c" >/dev/null 2>&1; then command -v "$c"; return; fi
  done
  echo ""
}

CHROME_BIN="$(find_chrome)"
if [ -z "$CHROME_BIN" ]; then
  echo "No headless Chrome found. Install one, or set CHROME=/path/to/chrome." >&2
  exit 1
fi

PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE"' EXIT

# route:slug — the slug is the filename segment, readable and stable.
routes=(
  "/:home"
  "/shop:shop"
  "/shop/p1:shop-p1"
  "/archive:archive"
  "/post/1870461511266088094:post-hero"
)
sizes=( "1440x900" "375x812" )

capture() {
  local route="$1" slug="$2" w="$3" h="$4"
  local file="$OUT_DIR/${w}x${h}-${slug}.png"
  "$CHROME_BIN" \
    --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$PROFILE" \
    --window-size="$w,$h" \
    --virtual-time-budget=4000 \
    --force-prefers-reduced-motion \
    --force-device-scale-factor=1 \
    --screenshot="$file" \
    "$BASE_URL$route" >/dev/null 2>&1
  if [ ! -s "$file" ]; then
    echo "FAILED (empty): $route at ${w}x${h}" >&2
    return 1
  fi
  echo "Captured $route at ${w}x${h} -> $(basename "$file")"
}

fail=0
for size in "${sizes[@]}"; do
  w="${size%x*}"; h="${size#*x}"
  for entry in "${routes[@]}"; do
    capture "${entry%%:*}" "${entry##*:}" "$w" "$h" || fail=1
  done
done

if [ "$fail" -ne 0 ]; then
  echo "Some captures failed — is the dev server up at $BASE_URL ?" >&2
  exit 1
fi

echo "Done. Screenshots in $OUT_DIR"

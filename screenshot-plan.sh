#!/usr/bin/env bash
# Capture desktop + mobile screenshots of EliteHuman dev server
# Requires: npm run dev running on :5173, and a headless capture tool.
set -euo pipefail

BASE_URL="http://localhost:5173/EliteHuman"
OUT_DIR="/home/arch/Applications/Play-Site/EliteHuman/screenshots"
mkdir -p "$OUT_DIR"

routes=( "/" "/shop" "/shop/p1" "/archive" "/post/1" )
sizes=( "1440x900" "375x812" )

for size in "${sizes[@]}"; do
  w=$(echo $size | cut -d'x' -f1)
  for route in "${routes[@]}"; do
    file="${OUT_DIR}/${size//x/-}${route#/}_$(basename $route).png"
    echo "Capturing $BASE_URL$route at $size -> $file"
    # Placeholder: replace with your capture tool (e.g., puppeteer, playwright, chrome headless)
    # Example with puppeteer:
    # node -e "import('puppeteer').then(m=>m.default.launch({args:['--no-sandbox']}).then(async b=>{const p=await b.newPage();await p.setViewport({width:$w,height:900});await p.goto('$BASE_URL$route');await p.screenshot({path:'$file'});await b.close();}))"
    # For now, create empty placeholder:
    touch "$file"
  done
done

echo "Done. Screenshots in $OUT_DIR"

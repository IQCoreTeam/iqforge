#!/usr/bin/env bash
# Pull the MIT-licensed builders studied in STUDY.md (sources aren't committed).
set -e
cd "$(dirname "$0")"
[ -d craft.js ] || git clone --depth 1 https://github.com/prevwong/craft.js
[ -d puck ]     || git clone --depth 1 https://github.com/puckeditor/puck
echo "Done. GrapesJS (BSD-3, not MIT) intentionally not pulled — see STUDY.md."

#!/bin/sh
# Install or update the DSNDay Übersicht widget.
# Copies index.jsx and the current dsnday.html into the Übersicht widgets folder.
# Usage: ubersicht/install.sh [widgets-folder]
set -eu

here=$(cd "$(dirname "$0")" && pwd)
repo=$(dirname "$here")
dest_root=${1:-"$HOME/Library/Application Support/Übersicht/widgets"}
dest="$dest_root/dsnday.widget"

if [ ! -d "$dest_root" ]; then
  echo "Widgets folder not found: $dest_root" >&2
  echo "Pass the folder as an argument (Übersicht menu > Open Widgets Folder shows it)." >&2
  exit 1
fi

mkdir -p "$dest"
# Keep a hand-edited index.jsx (position, options); only add it if missing.
if [ -f "$dest/index.jsx" ] && ! cmp -s "$here/dsnday.widget/index.jsx" "$dest/index.jsx"; then
  echo "Keeping your edited $dest/index.jsx (repo version: $here/dsnday.widget/index.jsx)"
else
  cp "$here/dsnday.widget/index.jsx" "$dest/index.jsx"
fi
cp "$repo/dsnday.html" "$dest/dsnday.html"
echo "Installed to $dest"
echo "Übersicht reloads widgets automatically; if not, use its menu > Refresh All Widgets."

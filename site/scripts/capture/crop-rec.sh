#!/usr/bin/env bash
# Crop a session.cjs recording to a highlight, from the raw frames (sharper than
# cropping the scaled mp4). Screencast frames usually arrive at 1x; the scale is
# read from the first frame against VW (1680). Rect in CSS px, as `iso` logs it, plus padding.
#
#   ./crop-rec.sh <frames-dir> <out-dir>/<name> <x> <y> <w> <h> [pad=40] [width=1280]
#
# Writes <name>.mp4, <name>.webm and <name>.webp (poster: the first frame).
set -euo pipefail
dir=$1; out=$2; pad=${7:-40}; width=${8:-}
fw=$(sips -g pixelWidth "$dir/000000.jpg" | awk '/pixelWidth/ {print $2}')
k=$(( fw / ${VW:-1680} ))
x=$(( ($3 - pad) * k )); y=$(( ($4 - pad) * k ))
w=$(( ($5 + pad * 2) * k / 2 * 2 )); h=$(( ($6 + pad * 2) * k / 2 * 2 ))
width=${width:-$w}
vf="crop=$w:$h:$x:$y,scale=$width:-2:flags=lanczos,fps=60,format=yuv420p"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$dir/list.txt" -vf "$vf" -c:v libx264 -preset slow -crf 16 -movflags +faststart "$out.mp4"
ffmpeg -y -loglevel error -i "$out.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -row-mt 1 "$out.webm"
ffmpeg -y -loglevel error -i "$out.mp4" -frames:v 1 -f image2pipe -vcodec png - | cwebp -quiet -q 90 -o "$out.webp" -- -
echo "$out.mp4 (${w}x${h} at ${k}x)"

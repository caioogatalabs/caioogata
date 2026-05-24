#!/bin/bash
# Extract JPEG frames from about video for scroll-driven canvas playback.
# Usage: chmod +x scripts/extract-frames.sh && bash scripts/extract-frames.sh
#
# If ffmpeg has libwebp support, change -q:v to -quality 80 and output to .webp.
# Falls back to JPEG for broad ffmpeg compatibility.

set -euo pipefail

# Guard: ffmpeg required
command -v ffmpeg >/dev/null 2>&1 || { echo "ERROR: ffmpeg is required but not installed. Install via: brew install ffmpeg"; exit 1; }

# Guard: source video must exist
SOURCE="about-refs/caio-about-video-hero.mp4"
[ -f "$SOURCE" ] || { echo "ERROR: Source video not found at $SOURCE"; exit 1; }

# Output directory
mkdir -p public/about-frames

echo "Extracting frames from $SOURCE..."
ffmpeg -i "$SOURCE" -vf "scale=1280:-1" -q:v 4 public/about-frames/frame-%03d.jpg -y

FRAME_COUNT=$(ls public/about-frames/frame-*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "Done. Extracted $FRAME_COUNT frames to public/about-frames/"

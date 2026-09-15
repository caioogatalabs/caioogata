#!/usr/bin/env python3
"""
Test composition with custom undertone BG (coral + blue-grey).
Uses compose-images.py core functions directly.
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from importlib.util import spec_from_file_location, module_from_spec
spec = spec_from_file_location("compose", os.path.join(os.path.dirname(__file__), "compose-images.py"))
compose = module_from_spec(spec)
spec.loader.exec_module(compose)

SCRIPT_DIR = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(SCRIPT_DIR, '..', 'public', 'projects', 'azion-website', 'test-compose')
CANVAS_W, CANVAS_H = 1600, 1000

# Undertone palette (from reference image)
CORAL = (255, 120, 100)
SALMON = (250, 150, 120)
SOFT_PEACH = (240, 170, 150)
BLUE_GREY = (185, 200, 210)
LIGHT_GREY = (200, 205, 210)
WARM_WHITE = (220, 210, 205)


def create_undertone_bg(w, h, seed=42):
    """Undertone 01 style: salmon/coral with visible color presence before dissolving."""
    from PIL import ImageDraw, ImageFilter
    import random

    random.seed(seed)
    bg = Image.new('RGB', (w, h), LIGHT_GREY)
    draw = ImageDraw.Draw(bg)

    # Layer 1: large base blobs (subtle, heavily blurred)
    for color in [BLUE_GREY, SOFT_PEACH, LIGHT_GREY]:
        for _ in range(2):
            cx = random.randint(-w // 4, w + w // 4)
            cy = random.randint(-h // 4, h + h // 4)
            rw = random.randint(w // 3, w)
            rh = random.randint(h // 3, h)
            draw.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=color)

    bg = bg.filter(ImageFilter.GaussianBlur(radius=100))

    # Layer 2: salmon/coral accent blobs (smaller, less blurred — visible identity)
    accent = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    accent_draw = ImageDraw.Draw(accent)

    for color in [SALMON, CORAL, SALMON]:
        cx = random.randint(w // 6, w * 2 // 3)
        cy = random.randint(h // 6, h * 2 // 3)
        rw = random.randint(w // 5, w // 3)
        rh = random.randint(h // 5, h // 3)
        accent_draw.ellipse([cx - rw, cy - rh, cx + rw, cy + rh],
                            fill=color + (200,))

    # Medium blur — dissolves edges but keeps the color mass visible
    accent = accent.filter(ImageFilter.GaussianBlur(radius=60))

    bg = bg.convert('RGBA')
    bg = Image.alpha_composite(bg, accent)
    return bg.convert('RGB')


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    hero_src = os.path.join(SCRIPT_DIR, 'azion-hero-raw.png')
    construa_src = os.path.join(SCRIPT_DIR, 'azion-construa-raw.png')

    print('\n🎨 Composing with Undertone BG\n')

    # --- Image 1: Hero — Overview with undertone BG ---
    print('1. Hero — Overview + Undertone')

    bg = create_undertone_bg(CANVAS_W, CANVAS_H, seed=50)
    screenshot = Image.open(hero_src).convert('RGB')

    # src_crop: trim sides for taller aspect
    sw, sh = screenshot.size
    screenshot = screenshot.crop((int(0.08 * sw), 0, int(0.92 * sw), sh))

    # Scale to fit with side + top padding
    bg_ratio = 0.10
    side_pad = int(CANVAS_W * bg_ratio)
    top_pad = int(CANVAS_H * bg_ratio)
    target_w = CANVAS_W - (side_pad * 2)
    sw, sh = screenshot.size
    target_h = int(target_w * sh / sw)

    # Ensure bottom bleed
    min_h = CANVAS_H - top_pad + int(CANVAS_H * 0.02)
    if target_h < min_h:
        target_h = min_h
        target_w = int(target_h * sw / sh)

    screenshot = screenshot.resize((target_w, target_h), Image.LANCZOS)
    screenshot_rgba = compose.add_selective_rounded_corners(screenshot, 12, corners=('tl', 'tr'))

    x = (CANVAS_W - target_w) // 2
    y = top_pad

    bg_rgba = bg.convert('RGBA')
    bg_rgba.paste(screenshot_rgba, (x, y), screenshot_rgba)
    result = bg_rgba.crop((0, 0, CANVAS_W, CANVAS_H)).convert('RGB')

    out1 = os.path.join(OUTPUT_DIR, 'test-hero-undertone.webp')
    result.save(out1, 'WEBP', quality=85)
    print(f'  ✓ {os.path.basename(out1)}: {target_w}x{target_h}, {os.path.getsize(out1)/1024:.0f}KB')

    # --- Image 2: Zoom detail with undertone BG ---
    print('2. Construa — Zoom + Undertone')

    bg = create_undertone_bg(CANVAS_W, CANVAS_H, seed=51)
    screenshot = Image.open(construa_src).convert('RGB')

    # Crop to detail region
    sw, sh = screenshot.size
    screenshot = screenshot.crop((
        int(0.08 * sw), int(0.05 * sh),
        int(0.82 * sw), int(0.72 * sh)
    ))

    # Scale with left + top padding
    bg_ratio = 0.15
    left_pad = int(CANVAS_W * bg_ratio)
    top_pad = int(CANVAS_H * bg_ratio)
    target_w = CANVAS_W - left_pad + int(CANVAS_W * 0.05)
    sw, sh = screenshot.size
    target_h = int(target_w * sh / sw)

    if target_h + top_pad < CANVAS_H:
        target_h = CANVAS_H - top_pad + int(CANVAS_H * 0.05)
        target_w = int(target_h * sw / sh)

    screenshot = screenshot.resize((target_w, target_h), Image.LANCZOS)
    screenshot_rgba = compose.add_selective_rounded_corners(screenshot, 12, corners=('tl',))

    bg_rgba = bg.convert('RGBA')
    bg_rgba.paste(screenshot_rgba, (left_pad, top_pad), screenshot_rgba)
    result = bg_rgba.crop((0, 0, CANVAS_W, CANVAS_H)).convert('RGB')

    out2 = os.path.join(OUTPUT_DIR, 'test-construa-undertone.webp')
    result.save(out2, 'WEBP', quality=85)
    print(f'  ✓ {os.path.basename(out2)}: {target_w}x{target_h}, {os.path.getsize(out2)/1024:.0f}KB')

    print(f'\n✅ Done! Check {OUTPUT_DIR}')


if __name__ == '__main__':
    main()

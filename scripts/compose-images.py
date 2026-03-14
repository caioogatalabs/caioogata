#!/usr/bin/env python3
"""
Compose case study images following PROJECTS-GUIDE.md patterns.

Two composition patterns:
  - Overview (Pattern 1): center-top anchor, bleed bottom, BG top + sides
  - Zoom/Detail (Pattern 2): bottom-right anchor, bleed right + bottom, BG top + left

See PROJECTS-GUIDE.md for full documentation.
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import random

CANVAS_W, CANVAS_H = 1600, 1000
CORNER_RADIUS = 12
DARK_BASE = (8, 8, 8)  # #080808

# Azion brand colors
ORANGE = (243, 101, 43)        # #F3652B
DARK_ORANGE = (200, 70, 20)
BURNT_ORANGE = (180, 55, 15)
DEEP_ORANGE = (140, 40, 10)
LAVENDER = (184, 169, 212)     # #B8A9D4
WARM_BLACK = (30, 20, 15)

# Undertone palette (coral/salmon with blue-grey)
CORAL = (255, 120, 100)
SALMON = (250, 150, 120)
SOFT_PEACH = (240, 170, 150)
BLUE_GREY = (185, 200, 210)
LIGHT_GREY = (200, 205, 210)
WARM_WHITE = (220, 210, 205)


# ---------------------------------------------------------------------------
# Background generation
# ---------------------------------------------------------------------------

def create_gradient_blur_bg(w, h, colors, blur_radius=80, seed=None, base_color=None):
    """Create gradient background with colored bokeh blobs on a base color."""
    if seed is not None:
        random.seed(seed)

    base = base_color if base_color else DARK_BASE
    bg = Image.new('RGB', (w, h), base)
    draw = ImageDraw.Draw(bg)

    # Paint large color blobs at asymmetric positions
    for color in colors:
        for _ in range(3):
            cx = random.randint(-w // 4, w + w // 4)
            cy = random.randint(-h // 4, h + h // 4)
            rw = random.randint(w // 3, w)
            rh = random.randint(h // 3, h)
            draw.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=color)

    # Heavy blur for bokeh/unfocused-light effect
    bg = bg.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    return bg


def create_orange_bg(w, h, variant='warm', seed=42):
    """Create orange-dominant gradient blur background on dark base."""
    variants = {
        'warm': [ORANGE, DARK_ORANGE, BURNT_ORANGE],
        'hot': [ORANGE, (255, 120, 50), DARK_ORANGE],
        'sunset': [ORANGE, DARK_ORANGE, (60, 20, 10)],
        'contrast': [ORANGE, DARK_ORANGE, (40, 15, 5)],
        'lavender_accent': [ORANGE, DARK_ORANGE, LAVENDER],
        'deep': [DEEP_ORANGE, BURNT_ORANGE, ORANGE],
    }
    colors = variants.get(variant, variants['warm'])
    return create_gradient_blur_bg(w, h, colors, blur_radius=90, seed=seed)


def create_custom_bg(w, h, base_color, blob_colors, blur_radius=90, seed=42):
    """Create gradient background with custom base and blob colors.
    Use this for non-orange project palettes."""
    return create_gradient_blur_bg(w, h, blob_colors, blur_radius=blur_radius,
                                   seed=seed, base_color=base_color)


def create_undertone_bg(w, h, seed=42):
    """Undertone style: salmon/coral with visible color presence before dissolving."""
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


# ---------------------------------------------------------------------------
# Selective rounded corners
# ---------------------------------------------------------------------------

def add_selective_rounded_corners(img, radius, corners=('tl', 'tr', 'bl', 'br')):
    """
    Add rounded corners only on specified edges.
    corners: tuple of 'tl', 'tr', 'bl', 'br' (top-left, top-right, bottom-left, bottom-right)
    """
    w, h = img.size
    mask = Image.new('L', (w, h), 255)
    draw = ImageDraw.Draw(mask)

    # Start with full rounded rectangle
    full_mask = Image.new('L', (w, h), 0)
    full_draw = ImageDraw.Draw(full_mask)
    full_draw.rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255)

    # For corners we DON'T want rounded, fill those quadrants back to square
    patch = Image.new('L', (radius + 1, radius + 1), 255)
    if 'tl' not in corners:
        full_mask.paste(patch, (0, 0))
    if 'tr' not in corners:
        full_mask.paste(patch, (w - radius - 1, 0))
    if 'bl' not in corners:
        full_mask.paste(patch, (0, h - radius - 1))
    if 'br' not in corners:
        full_mask.paste(patch, (w - radius - 1, h - radius - 1))

    result = img.copy().convert('RGBA')
    result.putalpha(full_mask)
    return result


# ---------------------------------------------------------------------------
# Pattern 1: Overview (center-top, bleed bottom)
# ---------------------------------------------------------------------------

def compose_overview(screenshot_path, output_path, bg_variant='warm', bg_ratio=0.10,
                     corner_radius=CORNER_RADIUS, src_crop=None, seed=42, bg=None):
    """
    Pattern 1: Overview composition.

    - Anchor: center-top
    - BG breathing: top (~bg_ratio) + sides (~bg_ratio * 0.7)
    - Bleed: bottom edge
    - Rounded corners: top-left + top-right only

    src_crop: (left, top, right, bottom) relative coords to trim source before composing.
              e.g. (0.08, 0.0, 0.92, 1.0) trims 8% from each side.
    bg: pre-created background image. If None, creates orange BG.
    """
    if bg is None:
        bg = create_orange_bg(CANVAS_W, CANVAS_H, variant=bg_variant, seed=seed)

    screenshot = Image.open(screenshot_path).convert('RGB')

    # Pre-crop source if specified
    if src_crop:
        sw, sh = screenshot.size
        screenshot = screenshot.crop((
            int(src_crop[0] * sw), int(src_crop[1] * sh),
            int(src_crop[2] * sw), int(src_crop[3] * sh)
        ))

    # Calculate placement
    side_padding = int(CANVAS_W * bg_ratio * 0.7)
    top_padding = int(CANVAS_H * bg_ratio)
    target_w = CANVAS_W - (side_padding * 2)

    # Scale maintaining aspect ratio
    sw, sh = screenshot.size
    target_h = int(target_w * sh / sw)
    screenshot = screenshot.resize((target_w, target_h), Image.LANCZOS)

    # Rounded corners on top only (bottom bleeds off canvas)
    screenshot_rounded = add_selective_rounded_corners(screenshot, corner_radius, corners=('tl', 'tr'))

    # Place: centered horizontally, top_padding from top, bleeds bottom
    x = side_padding
    y = top_padding

    bg_rgba = bg.convert('RGBA')
    bg_rgba.paste(screenshot_rounded, (x, y), screenshot_rounded)

    result = bg_rgba.convert('RGB').crop((0, 0, CANVAS_W, CANVAS_H))
    result.save(output_path, 'WEBP', quality=85)
    _log(output_path, target_w, target_h)


# ---------------------------------------------------------------------------
# Pattern 2: Zoom / Detail (bottom-right anchor, bleed right + bottom)
# ---------------------------------------------------------------------------

def compose_zoom_detail(screenshot_path, output_path, crop_box, bg_variant='warm',
                        bg_ratio=0.15, corner_radius=CORNER_RADIUS, seed=42, bg=None):
    """
    Pattern 2: Zoom/Detail composition.

    - Anchor: bottom-right
    - BG breathing: top (~bg_ratio) + left (~bg_ratio)
    - Bleed: right + bottom edges
    - Rounded corners: top-left only

    crop_box: (left, top, right, bottom) relative coords for the detail region.
    bg: pre-created background image. If None, creates orange BG.
    """
    if bg is None:
        bg = create_orange_bg(CANVAS_W, CANVAS_H, variant=bg_variant, seed=seed)

    screenshot = Image.open(screenshot_path).convert('RGB')

    # Crop to detail region
    sw, sh = screenshot.size
    screenshot = screenshot.crop((
        int(crop_box[0] * sw), int(crop_box[1] * sh),
        int(crop_box[2] * sw), int(crop_box[3] * sh)
    ))

    # Scale: image should extend beyond canvas on right + bottom
    left_padding = int(CANVAS_W * bg_ratio)
    top_padding = int(CANVAS_H * bg_ratio)
    target_w = CANVAS_W - left_padding  # fills from left_padding to right edge (and beyond)

    sw, sh = screenshot.size
    target_h = int(target_w * sh / sw)

    # If target_h doesn't reach bottom edge, scale up to fill
    min_h = CANVAS_H - top_padding
    if target_h < min_h:
        target_h = min_h
        target_w = int(target_h * sw / sh)

    screenshot = screenshot.resize((target_w, target_h), Image.LANCZOS)

    # Rounded corner on top-left only (other corners bleed off canvas)
    screenshot_rounded = add_selective_rounded_corners(screenshot, corner_radius, corners=('tl',))

    # Place: left_padding from left, top_padding from top
    x = left_padding
    y = top_padding

    bg_rgba = bg.convert('RGBA')
    bg_rgba.paste(screenshot_rounded, (x, y), screenshot_rounded)

    result = bg_rgba.convert('RGB').crop((0, 0, CANVAS_W, CANVAS_H))
    result.save(output_path, 'WEBP', quality=85)
    _log(output_path, target_w, target_h)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _log(output_path, w, h):
    size_kb = os.path.getsize(output_path) / 1024
    print(f'  > {os.path.basename(output_path)}: {w}x{h} on {CANVAS_W}x{CANVAS_H}, {size_kb:.0f}KB')


# ---------------------------------------------------------------------------
# Azion Website — per-project composition
# ---------------------------------------------------------------------------

def main():
    """Compose all Azion Website case study images with undertone BG."""
    script_dir = os.path.dirname(__file__)
    base = os.path.join(script_dir, '..', 'public', 'projects', 'azion-website')

    src = lambda name: os.path.join(script_dir, name)
    out = lambda name: os.path.join(base, name)

    print('\n  Composing Azion Website case study images (undertone BG)...\n')

    # 1. Home EN — Overview
    print('  1. Home EN Hero (overview)')
    compose_overview(
        src('azion-home-en-raw.png'), out('home-en-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=60),
        bg_ratio=0.10,
        src_crop=(0.08, 0.0, 0.92, 1.0),
    )

    # 2. Home PT — Overview
    print('  2. Home PT Hero (overview)')
    compose_overview(
        src('azion-home-pt-raw.png'), out('home-pt-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=61),
        bg_ratio=0.10,
        src_crop=(0.08, 0.0, 0.92, 1.0),
    )

    # 3. Reliable Infrastructure — Zoom
    print('  3. Most Reliable Infrastructure (zoom)')
    compose_zoom_detail(
        src('azion-home-reliable-raw.png'), out('home-reliable-zoom.webp'),
        crop_box=(0.05, 0.30, 0.92, 1.0),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=62),
        bg_ratio=0.15,
    )

    # 4. Products Menu — Zoom
    print('  4. Products Menu (zoom)')
    compose_zoom_detail(
        src('azion-home-products-menu-raw.png'), out('home-products-menu-zoom.webp'),
        crop_box=(0.0, 0.0, 0.65, 0.55),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=63),
        bg_ratio=0.15,
    )

    # 5. Functions Hero — Overview (full page shows hero + code + metrics)
    print('  5. Functions Hero (overview)')
    compose_overview(
        src('azion-functions-hero-raw.png'), out('functions-hero-zoom.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=64),
        bg_ratio=0.10,
        src_crop=(0.05, 0.0, 0.95, 1.0),
    )

    # 6. Functions Code Section — Zoom
    print('  6. Functions Code to Production (zoom)')
    compose_zoom_detail(
        src('azion-functions-code-raw.png'), out('functions-code-zoom.webp'),
        crop_box=(0.08, 0.52, 0.88, 1.0),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=65),
        bg_ratio=0.15,
    )

    # 7. Cache Hero — Overview
    print('  7. Cache Hero (overview)')
    compose_overview(
        src('azion-cache-hero-raw.png'), out('cache-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=66),
        bg_ratio=0.10,
        src_crop=(0.08, 0.0, 0.92, 1.0),
    )

    print('\n  Done!\n')


if __name__ == '__main__':
    main()

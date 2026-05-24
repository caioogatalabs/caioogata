#!/usr/bin/env python3
"""
Compose case study images following PROJECTS-GUIDE.md alignments.

Three composition alignments (content-first):
  - Center: BG top + sides, bleed bottom — "show the page"
  - Top-left: BG top + left, bleed right + bottom — "detail on the left"
  - Top-right: BG top + right, bleed left + bottom — "detail on the right"

See PROJECTS-GUIDE.md for full documentation.
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import random

# ---------------------------------------------------------------------------
# Project-level variables
# ---------------------------------------------------------------------------

CANVAS_W, CANVAS_H = 1600, 1000   # Output size (16:10, MacBook Pro ratio)
MARGIN = 120                       # BG margin: 120px fixed on all exposed sides
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
# Center alignment: BG top + sides, bleed bottom — "show the page"
# ---------------------------------------------------------------------------

def compose_center(screenshot_path, output_path, bg_variant='warm',
                   corner_radius=CORNER_RADIUS, src_crop=None, seed=42, bg=None,
                   canvas_h=None):
    """
    Center alignment composition.

    - Margins: top + left + right (120px each)
    - Bleeds: bottom
    - Rounded corners: top-left + top-right
    - Anchor: top (y = MARGIN). Bottom is the bleed edge.

    src_crop: (left, top, right, bottom) relative coords for content selection.
              e.g. (0.0, 0.25, 1.0, 1.0) skips top 25% (navbar area).
    canvas_h: Override output height (P4 — last resort when src_crop makes image
              too short to bleed at default 1000px). Width stays at CANVAS_W.
    """
    out_h = canvas_h if canvas_h else CANVAS_H

    if bg is None:
        bg = create_orange_bg(CANVAS_W, out_h, variant=bg_variant, seed=seed)

    screenshot = Image.open(screenshot_path).convert('RGB')

    # Content selection crop
    if src_crop:
        sw, sh = screenshot.size
        screenshot = screenshot.crop((
            int(src_crop[0] * sw), int(src_crop[1] * sh),
            int(src_crop[2] * sw), int(src_crop[3] * sh)
        ))

    # Calculate placement with fixed margin
    side_padding = MARGIN
    target_w = CANVAS_W - (side_padding * 2)

    # Scale maintaining aspect ratio
    sw, sh = screenshot.size
    target_h = int(target_w * sh / sw)
    screenshot = screenshot.resize((target_w, target_h), Image.LANCZOS)

    # Rounded corners on top only (bottom bleeds off canvas)
    screenshot_rounded = add_selective_rounded_corners(screenshot, corner_radius, corners=('tl', 'tr'))

    # Place: centered horizontally, anchored to top (y = MARGIN)
    x = side_padding
    y = MARGIN

    bg_rgba = bg.convert('RGBA')
    bg_rgba.paste(screenshot_rounded, (x, y), screenshot_rounded)

    result = bg_rgba.convert('RGB').crop((0, 0, CANVAS_W, out_h))
    result.save(output_path, 'WEBP', quality=85)
    _log(output_path, target_w, target_h, canvas_h=out_h)


# ---------------------------------------------------------------------------
# Top-left alignment: BG top + left, bleed right + bottom — "detail on the left"
# ---------------------------------------------------------------------------

def compose_top_left(screenshot_path, output_path, crop_box, bg_variant='warm',
                     corner_radius=CORNER_RADIUS, seed=42, bg=None):
    """
    Top-left alignment composition.

    - Margins: top + left (120px each)
    - Bleeds: right + bottom
    - Rounded corners: top-left only

    crop_box: (left, top, right, bottom) relative coords for the detail region.
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
    left_padding = MARGIN
    top_padding = MARGIN
    target_w = CANVAS_W - left_padding

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
# Top-right alignment: BG top + right, bleed left + bottom — "detail on the right"
# ---------------------------------------------------------------------------

def compose_top_right(screenshot_path, output_path, crop_box=None, bg_variant='warm',
                      corner_radius=CORNER_RADIUS, src_crop=None, seed=42, bg=None):
    """
    Top-right alignment composition.

    - Margins: top + right (120px each)
    - Bleeds: left + bottom
    - Rounded corners: top-right only

    crop_box: (left, top, right, bottom) relative coords for the detail region.
    src_crop: (left, top, right, bottom) relative coords for content selection.
    """
    if bg is None:
        bg = create_orange_bg(CANVAS_W, CANVAS_H, variant=bg_variant, seed=seed)

    screenshot = Image.open(screenshot_path).convert('RGB')

    # Content selection (coarse — e.g. skip navbar)
    if src_crop:
        sw, sh = screenshot.size
        screenshot = screenshot.crop((
            int(src_crop[0] * sw), int(src_crop[1] * sh),
            int(src_crop[2] * sw), int(src_crop[3] * sh)
        ))

    # Detail region crop (fine — zoom into specific area)
    if crop_box:
        sw, sh = screenshot.size
        screenshot = screenshot.crop((
            int(crop_box[0] * sw), int(crop_box[1] * sh),
            int(crop_box[2] * sw), int(crop_box[3] * sh)
        ))

    # Scale: fill from left edge, leave right padding for BG
    right_padding = MARGIN
    top_padding = MARGIN
    target_w = CANVAS_W - right_padding

    sw, sh = screenshot.size
    target_h = int(target_w * sh / sw)

    # Ensure image reaches bottom
    min_h = CANVAS_H - top_padding
    if target_h < min_h:
        target_h = min_h
        target_w = int(target_h * sw / sh)

    screenshot = screenshot.resize((target_w, target_h), Image.LANCZOS)

    # Rounded corner on top-right only (other corners bleed off)
    screenshot_rounded = add_selective_rounded_corners(screenshot, corner_radius, corners=('tr',))

    # Place: flush left (x=0), top_padding from top, bleeds left + bottom
    x = 0
    y = top_padding

    bg_rgba = bg.convert('RGBA')
    bg_rgba.paste(screenshot_rounded, (x, y), screenshot_rounded)

    result = bg_rgba.convert('RGB').crop((0, 0, CANVAS_W, CANVAS_H))
    result.save(output_path, 'WEBP', quality=85)
    _log(output_path, target_w, target_h)


# ---------------------------------------------------------------------------
# Product Strip: multiple screenshots side-by-side in horizontal strip
# ---------------------------------------------------------------------------

def compose_product_strip(screenshot_paths, crop_boxes, output_path,
                          corner_radius=CORNER_RADIUS, gap=10, pad_y=40,
                          seed=42, bg=None):
    """
    Compose multiple product screenshots in a horizontal strip on a single canvas.

    screenshot_paths: list of screenshot file paths
    crop_boxes: list of (left, top, right, bottom) relative crop coords
    gap: pixel gap between strips
    pad_y: vertical padding (increase to make strips shorter)
    """
    if bg is None:
        bg = create_undertone_bg(CANVAS_W, CANVAS_H, seed=seed)

    n = len(screenshot_paths)
    total_gap = gap * (n - 1)
    pad_x = 40
    strip_w = (CANVAS_W - 2 * pad_x - total_gap) // n
    strip_h = CANVAS_H - 2 * pad_y

    bg_rgba = bg.convert('RGBA')

    for i, (path, crop_box) in enumerate(zip(screenshot_paths, crop_boxes)):
        screenshot = Image.open(path).convert('RGB')
        sw, sh = screenshot.size

        # Crop to detail region
        cropped = screenshot.crop((
            int(crop_box[0] * sw), int(crop_box[1] * sh),
            int(crop_box[2] * sw), int(crop_box[3] * sh)
        ))

        # Scale to fill strip slot (crop to fit aspect ratio)
        cw, ch = cropped.size
        target_ratio = strip_w / strip_h
        current_ratio = cw / ch

        if current_ratio > target_ratio:
            # Too wide — crop sides
            new_w = int(ch * target_ratio)
            offset = (cw - new_w) // 2
            cropped = cropped.crop((offset, 0, offset + new_w, ch))
        else:
            # Too tall — crop top/bottom
            new_h = int(cw / target_ratio)
            cropped = cropped.crop((0, 0, cw, new_h))

        cropped = cropped.resize((strip_w, strip_h), Image.LANCZOS)

        # Rounded corners on all 4 corners (each strip is fully visible)
        cropped_rounded = add_selective_rounded_corners(
            cropped, corner_radius, corners=('tl', 'tr', 'bl', 'br')
        )

        x = pad_x + i * (strip_w + gap)
        y = pad_y
        bg_rgba.paste(cropped_rounded, (x, y), cropped_rounded)

    result = bg_rgba.convert('RGB').crop((0, 0, CANVAS_W, CANVAS_H))
    result.save(output_path, 'WEBP', quality=85)
    size_kb = os.path.getsize(output_path) / 1024
    print(f'  > {os.path.basename(output_path)}: {n} strips {strip_w}x{strip_h}, {size_kb:.0f}KB')


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _log(output_path, w, h, canvas_w=CANVAS_W, canvas_h=CANVAS_H):
    size_kb = os.path.getsize(output_path) / 1024
    print(f'  > {os.path.basename(output_path)}: {w}x{h} on {canvas_w}x{canvas_h}, {size_kb:.0f}KB')


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

    # 1. Home EN — Center (hero + first logo row, crop bottom 27%)
    #    canvas_h=760: P4 adjustment — src_crop shortens image to 645px,
    #    at y=120 bottom=765, so 760 maintains bleed while keeping 120px top margin.
    print('  1. Home EN Hero (center)')
    compose_center(
        src('azion-home-en-raw.png'), out('home-en-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, 760, seed=60),
        src_crop=(0.0, 0.0, 1.0, 0.73),
        canvas_h=760,
    )

    # 2. Home PT — REMOVED (keeping raw for reference)

    # 3. Reliable Infrastructure — Center (section centered, no navbar)
    print('  3. Most Reliable Infrastructure (center)')
    compose_center(
        src('azion-home-reliable-raw.png'), out('home-reliable-zoom.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=62),
    )

    # 4. Products Menu — Top-left
    print('  4. Products Menu (top-left)')
    compose_top_left(
        src('azion-home-products-menu-raw.png'), out('home-products-menu-zoom.webp'),
        crop_box=(0.0, 0.0, 0.65, 0.55),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=63),
    )

    # 5. Functions Hero — Center (full viewport)
    print('  5. Functions Hero (center)')
    compose_center(
        src('azion-functions-hero-raw.png'), out('functions-hero-zoom.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=64),
    )

    # 6. Cache Hero — Center (full viewport)
    print('  6. Cache Hero (center)')
    compose_center(
        src('azion-cache-hero-raw.png'), out('cache-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=66),
    )

    # 7. Professional Services — Center (title/subtitle centered in DOM)
    print('  7. Professional Services (center)')
    compose_center(
        src('azion-professional-services-raw.png'), out('professional-services-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=70),
    )

    # 8. Documentation Devtools — Top-left (zoom 2/3 on tool cards)
    print('  8. Documentation Devtools (top-left)')
    compose_top_left(
        src('azion-devtools-raw.png'), out('devtools-zoom.webp'),
        crop_box=(0.0, 0.0, 0.67, 0.67),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=71),
    )

    # 9. Marketplace — Center (full viewport hero)
    print('  9. Marketplace (center)')
    compose_center(
        src('azion-marketplace-raw.png'), out('marketplace-hero.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=72),
    )

    # 10. Product Pages Strip — 4 products side by side
    print('  10. Product Pages Strip (4 products)')
    compose_product_strip(
        screenshot_paths=[
            src('azion-image-processor-raw.png'),
            src('azion-bot-manager-raw.png'),
            src('azion-load-balancer-raw.png'),
            src('azion-app-accelerator-raw.png'),
        ],
        crop_boxes=[
            (0.35, 0.05, 1.0, 0.55),  # Image Processor — hero with illustration
            (0.35, 0.05, 1.0, 0.55),  # Bot Manager — hero with chart
            (0.35, 0.05, 1.0, 0.55),  # Load Balancer — hero with UI
            (0.35, 0.05, 1.0, 0.55),  # App Accelerator — hero with UI
        ],
        output_path=out('products-strip.webp'),
        bg=create_undertone_bg(CANVAS_W, CANVAS_H, seed=67),
        gap=8,
        pad_y=280,
    )

    print('\n  Done!\n')


if __name__ == '__main__':
    main()

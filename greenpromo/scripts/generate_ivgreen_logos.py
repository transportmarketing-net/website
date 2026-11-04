#!/usr/bin/env python3
"""
IVgreen Logo Variants Generator
Generates all logo formats, favicons, social media assets from source JPEG.
"""

import argparse
import base64
import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np

# Brand colors
DARK_GREEN = (26, 70, 50)
PINK = (227, 50, 123)
CREAM = (240, 242, 231)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
SOURCE_PATH = Path.home() / "Downloads" / "watermarked_img_7026846379294150435.jpg"
OUTPUT_DIR = PROJECT_ROOT / "images" / "ivgreen"
WEBSITE_SVG_PATH = OUTPUT_DIR / "logo-promo.svg"


def _outline_text(font_path, text):
    """Outline text from a TTF font, return (svg_path_commands, bounds)."""
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.boundsPen import BoundsPen
    from fontTools.pens.transformPen import TransformPen

    with TTFont(font_path) as font:
        glyphs = font.getGlyphSet()
        cmap = font.getBestCmap()
        advances = font["hmtx"].metrics
        outline = SVGPathPen(glyphs)
        bounds = BoundsPen(glyphs)
        offset = 0
        for char in text:
            name = cmap[ord(char)]
            transform = (1, 0, 0, -1, offset, 0)
            glyphs[name].draw(TransformPen(outline, transform))
            glyphs[name].draw(TransformPen(bounds, transform))
            offset += advances[name][0]
    return outline.getCommands(), bounds.bounds


def create_website_logo_source():
    """The editable SVG is the source; do not rebuild an obsolete prefix."""
    raise FileNotFoundError("Restore images/ivgreen/logo-promo.svg before exporting website logos.")


def generate_website_logos():
    """Export only website wordmarks; never touch favicons or campaign artwork."""
    import gi
    import cairo

    gi.require_version("Rsvg", "2.0")
    from gi.repository import Rsvg

    if not WEBSITE_SVG_PATH.exists():
        create_website_logo_source()
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    svg_source = WEBSITE_SVG_PATH.read_text(encoding="utf-8")

    def export(filename, word_color="#1A4632", mono=None, background=None):
        root = ET.fromstring(svg_source)
        for node in root.iter():
            if node.get("id") in {"green-ink", "promo-ink"}:
                color = mono or (word_color if node.get("id") == "green-ink" else "#E3327B")
                node.set("fill", color)
        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 697, 247)
        context = cairo.Context(surface)
        if background:
            context.set_source_rgb(*(value / 255 for value in background))
            context.paint()
        viewport = Rsvg.Rectangle()
        viewport.x = viewport.y = 0
        viewport.width, viewport.height = 697, 247
        handle = Rsvg.Handle.new_from_data(ET.tostring(root, encoding="utf-8"))
        handle.render_document(context, viewport)
        surface.write_to_png(str(OUTPUT_DIR / filename))

    export("master-transparent.png")
    export("logo-light-bg.png")
    export("logo-dark-bg.png", word_color="#F0F2E7")
    export("logo-all-white.png", mono="#FFFFFF")
    export("logo-all-dark.png", mono="#1A4632")
    export("logo-on-white.png", background=WHITE)
    export("logo-on-black.png", word_color="#F0F2E7", background=BLACK)
    outputs = {name: None for name in ["logo-light-bg.png", "logo-dark-bg.png"]}
    copy_to_legacy_paths(outputs, website_only=True)
    print("Website logos exported: green wordmark with pink promo, no IV prefix.")

def euclidean_distance(c1, c2):
    """Calculate Euclidean distance between two RGB colors."""
    return np.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

def remove_background(img):
    """Remove dark green background using color-distance keying."""
    print("Removing background...")
    img_rgba = img.convert("RGBA")
    data = np.array(img_rgba)

    rgb = data[:, :, :3]
    alpha = np.full((data.shape[0], data.shape[1]), 255, dtype=np.uint8)

    # Calculate distance from dark green for each pixel
    distances = np.sqrt(
        (rgb[:, :, 0].astype(float) - DARK_GREEN[0]) ** 2 +
        (rgb[:, :, 1].astype(float) - DARK_GREEN[1]) ** 2 +
        (rgb[:, :, 2].astype(float) - DARK_GREEN[2]) ** 2
    )

    # Full transparency for pixels close to dark green (distance < 50)
    alpha[distances < 50] = 0

    # Linear alpha ramp for anti-aliasing (distance 50-70)
    edge_mask = (distances >= 50) & (distances < 70)
    alpha[edge_mask] = ((distances[edge_mask] - 50) / 20 * 255).astype(np.uint8)

    data[:, :, 3] = alpha
    img_transparent = Image.fromarray(data, "RGBA")

    # Gaussian blur on alpha channel for smooth edges
    alpha_channel = img_transparent.split()[3]
    alpha_blurred = alpha_channel.filter(ImageFilter.GaussianBlur(1.5))
    img_transparent.putalpha(alpha_blurred)

    # Defringe: replace RGB of semi-transparent pixels
    data = np.array(img_transparent)
    semi_transparent = (data[:, :, 3] > 0) & (data[:, :, 3] < 255)

    # Simple defringe: blend towards nearest opaque color
    for i in range(3):
        channel = data[:, :, i].astype(float)
        # Use cream color for defringing (dominant non-bg color)
        channel[semi_transparent] = channel[semi_transparent] * 0.5 + CREAM[i] * 0.5
        data[:, :, i] = channel.astype(np.uint8)

    img_transparent = Image.fromarray(data, "RGBA")

    # Auto-crop to content bounds with 10px padding
    bbox = img_transparent.getbbox()
    if bbox:
        padding = 10
        bbox = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(img_transparent.width, bbox[2] + padding),
            min(img_transparent.height, bbox[3] + padding)
        )
        img_transparent = img_transparent.crop(bbox)

    return img_transparent

def separate_tagline(img):
    """Separate main logo from tagline."""
    print("Separating tagline...")
    data = np.array(img)
    alpha = data[:, :, 3]

    # Find horizontal gap by scanning rows for content
    row_content = np.sum(alpha > 128, axis=1)

    # Find main logo bottom (last row with significant content before gap)
    # and tagline top (first row with content after gap)
    significant_threshold = img.width * 0.1
    content_rows = np.where(row_content > significant_threshold)[0]

    if len(content_rows) < 2:
        # No clear separation, use 70% as split point
        split_row = int(img.height * 0.7)
    else:
        # Find largest gap
        gaps = np.diff(content_rows)
        if len(gaps) > 0 and np.max(gaps) > 20:
            gap_idx = np.argmax(gaps)
            split_row = (content_rows[gap_idx] + content_rows[gap_idx + 1]) // 2
        else:
            split_row = int(img.height * 0.7)

    # Crop to just main logo (no tagline)
    img_notag = img.crop((0, 0, img.width, split_row))

    # Crop again to remove excess space
    bbox = img_notag.getbbox()
    if bbox:
        img_notag = img_notag.crop(bbox)

    return img_notag

def extract_iv_mark(img):
    """Extract just the 'IV' letters for icon use."""
    print("Extracting IV mark...")
    data = np.array(img)
    alpha = data[:, :, 3]

    # Find content columns
    col_content = np.sum(alpha > 128, axis=0)
    content_cols = np.where(col_content > img.height * 0.05)[0]

    if len(content_cols) == 0:
        # Fallback: use left 40%
        iv_width = int(img.width * 0.4)
    else:
        # Find gap between IV and "green"
        col_diff = np.diff(content_cols)
        if len(col_diff) > 0 and np.max(col_diff) > 20:
            gap_idx = np.argmax(col_diff)
            iv_width = content_cols[gap_idx] + 5
        else:
            iv_width = int(img.width * 0.35)

    # Crop to IV portion
    iv_mark = img.crop((0, 0, iv_width, img.height))

    # Crop to content
    bbox = iv_mark.getbbox()
    if bbox:
        iv_mark = iv_mark.crop(bbox)

    # Square-pad for icon use
    max_dim = max(iv_mark.width, iv_mark.height)
    padded = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    x = (max_dim - iv_mark.width) // 2
    y = (max_dim - iv_mark.height) // 2
    padded.paste(iv_mark, (x, y))

    return padded

def recolor_pixels(img, target_rgb):
    """Recolor all non-transparent pixels to target color."""
    data = np.array(img)
    mask = data[:, :, 3] > 0
    for i in range(3):
        data[:, :, i][mask] = target_rgb[i]
    return Image.fromarray(data, "RGBA")

def recolor_cream_only(img, target_rgb):
    """Recolor only cream pixels (keep pink as is)."""
    data = np.array(img)
    rgb = data[:, :, :3]
    alpha = data[:, :, 3]

    # Find cream pixels (closer to cream than to pink)
    dist_to_cream = np.sqrt(np.sum((rgb - CREAM) ** 2, axis=2))
    dist_to_pink = np.sqrt(np.sum((rgb - PINK) ** 2, axis=2))

    cream_mask = (dist_to_cream < dist_to_pink) & (alpha > 0)

    for i in range(3):
        data[:, :, i][cream_mask] = target_rgb[i]

    return Image.fromarray(data, "RGBA")

def composite_on_bg(img, bg_color):
    """Composite RGBA image on solid color background."""
    bg = Image.new("RGB", img.size, bg_color)
    bg.paste(img, (0, 0), img)
    return bg

def create_favicon_ico(sizes_dict):
    """Create multi-size ICO file."""
    images = [sizes_dict[size] for size in [16, 32, 48] if size in sizes_dict]
    return images

def generate_header_logos(master_notag):
    """Generate all header logo variants."""
    print("\nGenerating header logos...")

    variants = {}

    # Dark bg (original colors)
    variants["logo-dark-bg.png"] = master_notag.copy()

    # Light bg (recolor cream to dark green, keep pink)
    variants["logo-light-bg.png"] = recolor_cream_only(master_notag, DARK_GREEN)

    # All white silhouette
    variants["logo-all-white.png"] = recolor_pixels(master_notag, WHITE)

    # All dark silhouette
    variants["logo-all-dark.png"] = recolor_pixels(master_notag, DARK_GREEN)

    # On white background
    variants["logo-on-white.png"] = composite_on_bg(variants["logo-light-bg.png"], WHITE)

    # On black background
    variants["logo-on-black.png"] = composite_on_bg(variants["logo-dark-bg.png"], BLACK)

    return variants

def generate_favicons(iv_mark):
    """Generate all favicon sizes."""
    print("\nGenerating favicons...")

    # Create dark green background version
    iv_on_green = Image.new("RGBA", iv_mark.size, DARK_GREEN + (255,))
    iv_on_green.paste(iv_mark, (0, 0), iv_mark)

    sizes = {
        16: iv_on_green.resize((16, 16), Image.Resampling.LANCZOS),
        32: iv_on_green.resize((32, 32), Image.Resampling.LANCZOS),
        48: iv_on_green.resize((48, 48), Image.Resampling.LANCZOS),
        180: iv_on_green.resize((180, 180), Image.Resampling.LANCZOS),
        512: iv_on_green.resize((512, 512), Image.Resampling.LANCZOS),
    }

    return sizes

def generate_logo_marks(iv_mark):
    """Generate square logo marks."""
    print("\nGenerating logo marks...")

    variants = {}
    size = 1081

    # Dark bg
    dark_bg = Image.new("RGBA", (size, size), DARK_GREEN + (255,))
    iv_resized = iv_mark.resize((size, size), Image.Resampling.LANCZOS)
    dark_bg.paste(iv_resized, (0, 0), iv_resized)
    variants["logo-mark-dark-bg.png"] = dark_bg

    # Light bg (white background)
    light_bg = Image.new("RGBA", (size, size), WHITE + (255,))
    light_bg.paste(iv_resized, (0, 0), iv_resized)
    variants["logo-mark-light-bg.png"] = light_bg

    # Transparent
    transparent = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    transparent.paste(iv_resized, (0, 0), iv_resized)
    variants["logo-mark-transparent.png"] = transparent

    return variants

def generate_social_media(master_notag, master_withtag):
    """Generate social media assets."""
    print("\nGenerating social media assets...")

    assets = {}

    # Profile images (square, logo centered on dark green)
    for size in [400, 800]:
        profile = Image.new("RGBA", (size, size), DARK_GREEN + (255,))
        logo_size = int(size * 0.6)  # 20% padding on each side
        logo_resized = master_notag.copy()
        logo_resized.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)
        x = (size - logo_resized.width) // 2
        y = (size - logo_resized.height) // 2
        profile.paste(logo_resized, (x, y), logo_resized)
        assets[f"social-profile-{size}.png"] = profile

    # Cover images (use master with tagline)
    covers = {
        "facebook": (820, 312),
        "linkedin": (1584, 396),
        "twitter": (1500, 500),
    }

    for platform, (width, height) in covers.items():
        cover = Image.new("RGBA", (width, height), DARK_GREEN + (255,))
        logo_resized = master_withtag.copy()
        logo_resized.thumbnail((int(width * 0.5), int(height * 0.7)), Image.Resampling.LANCZOS)
        x = (width - logo_resized.width) // 2
        y = (height - logo_resized.height) // 2
        cover.paste(logo_resized, (x, y), logo_resized)
        assets[f"social-cover-{platform}.png"] = cover

    return assets

def generate_og_image(master_withtag):
    """Generate Open Graph image."""
    print("\nGenerating OG image...")

    og = Image.new("RGBA", (1200, 630), DARK_GREEN + (255,))
    logo_resized = master_withtag.copy()
    logo_resized.thumbnail((900, 450), Image.Resampling.LANCZOS)
    x = (1200 - logo_resized.width) // 2
    y = (630 - logo_resized.height) // 2
    og.paste(logo_resized, (x, y), logo_resized)

    return og

def generate_wallpapers(master_withtag):
    """Generate desktop and mobile wallpapers."""
    print("\nGenerating wallpapers...")

    wallpapers = {}

    # Desktop wallpapers
    for width, height in [(1920, 1080), (2560, 1440)]:
        wallpaper = Image.new("RGBA", (width, height), DARK_GREEN + (255,))
        logo_resized = master_withtag.copy()
        logo_resized.thumbnail((int(width * 0.4), int(height * 0.4)), Image.Resampling.LANCZOS)
        x = (width - logo_resized.width) // 2
        y = (height - logo_resized.height) // 2
        wallpaper.paste(logo_resized, (x, y), logo_resized)
        wallpapers[f"wallpaper-{width}x{height}.png"] = wallpaper

    # Mobile wallpaper
    wallpaper = Image.new("RGBA", (1080, 1920), DARK_GREEN + (255,))
    logo_resized = master_withtag.copy()
    logo_resized.thumbnail((int(1080 * 0.6), int(1920 * 0.3)), Image.Resampling.LANCZOS)
    x = (1080 - logo_resized.width) // 2
    y = (1920 - logo_resized.height) // 2
    wallpaper.paste(logo_resized, (x, y), logo_resized)
    wallpapers["wallpaper-mobile-1080x1920.png"] = wallpaper

    return wallpapers

def save_all(outputs):
    """Save all generated images."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"\nSaving to {OUTPUT_DIR}...")
    for filename, img in outputs.items():
        path = OUTPUT_DIR / filename
        if filename.endswith('.webp'):
            img.save(path, "WEBP", quality=90)
        else:
            img.save(path, "PNG", optimize=True)
        print(f"  ✓ {filename}")

def copy_to_legacy_paths(outputs, website_only=False):
    """Copy files to legacy paths for backwards compatibility."""
    print("\nCopying to legacy paths...")

    legacy_mappings = [
        ("logo-light-bg.png", "images/logo-black.png", 922),
        ("logo-light-bg.png", "images/greenpromo/logo-black.png", 922),
        ("logo-dark-bg.png", "images/logo-white.png", 922),
        ("logo-dark-bg.png", "images/greenpromo/logo-white.png", 922),
        ("logo-mark-light-bg.png", "images/logo-mark-black.png", None),
        ("logo-mark-dark-bg.png", "images/logo-mark-white.png", None),
        ("favicon.ico", "favicon.ico", None),
        ("favicon-32x32.png", "images/favicon-32x32.png", None),
        ("favicon-16x16.png", "images/favicon-16x16.png", None),
        ("favicon-180x180.png", "images/apple-touch-icon.png", None),
        ("favicon-512x512.png", "favicon.png", None),
    ]

    for source_name, dest_rel, width in legacy_mappings:
        if website_only and source_name not in {"logo-light-bg.png", "logo-dark-bg.png"}:
            continue
        source_path = OUTPUT_DIR / source_name
        dest_path = PROJECT_ROOT / dest_rel

        if not source_path.exists():
            print(f"  ⚠ Source not found: {source_name}")
            continue

        dest_path.parent.mkdir(parents=True, exist_ok=True)

        if width:
            # Resize to specific width
            img = Image.open(source_path)
            # Ensure RGBA mode preserved
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            aspect = img.height / img.width
            new_height = int(width * aspect)
            img_resized = img.resize((width, new_height), Image.Resampling.LANCZOS)
            # Ensure PNG saves with alpha
            img_resized.save(dest_path, "PNG", optimize=True)
        else:
            # Direct copy
            import shutil
            shutil.copy2(source_path, dest_path)

        print(f"  ✓ {dest_rel}")

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--website-logos-only", action="store_true",
                        help="Export the promo website logos and aliases without changing other brand assets.")
    args = parser.parse_args()
    if args.website_logos_only:
        generate_website_logos()
        return

    print("=" * 60)
    print("IVgreen Logo Variants Generator")
    print("=" * 60)

    if not SOURCE_PATH.exists():
        print(f"ERROR: Source image not found: {SOURCE_PATH}")
        sys.exit(1)

    # Load source
    print(f"\nLoading source: {SOURCE_PATH}")
    source = Image.open(SOURCE_PATH)
    print(f"  Size: {source.width}x{source.height}")

    # Step 1: Background removal
    master_transparent = remove_background(source)

    # Step 2: Separate tagline
    master_notag = separate_tagline(master_transparent)

    # Step 3: Extract IV mark from no-tagline version
    iv_mark = extract_iv_mark(master_notag)

    # Save master files
    outputs = {
        "master-transparent.png": master_transparent,
        "master-transparent-notag.png": master_notag,
        "iv-mark.png": iv_mark,
    }

    # Generate header variants (NO tagline for compact navbar)
    outputs.update(generate_header_logos(master_notag))

    favicon_sizes = generate_favicons(iv_mark)
    for size, img in favicon_sizes.items():
        if size == 180:
            outputs["favicon-180x180.png"] = img
        elif size == 512:
            outputs["favicon-512x512.png"] = img
        else:
            outputs[f"favicon-{size}x{size}.png"] = img

    outputs.update(generate_logo_marks(iv_mark))
    outputs.update(generate_social_media(master_notag, master_transparent))

    og_img = generate_og_image(master_transparent)
    outputs["og-image.png"] = og_img
    outputs["og-image.webp"] = og_img

    outputs.update(generate_wallpapers(master_transparent))

    # Save everything
    save_all(outputs)

    # Create ICO file
    print("\nCreating favicon.ico...")
    ico_images = [favicon_sizes[16], favicon_sizes[32], favicon_sizes[48]]
    ico_path = OUTPUT_DIR / "favicon.ico"
    ico_images[0].save(ico_path, format="ICO", sizes=[(16,16), (32,32), (48,48)])
    print(f"  ✓ favicon.ico")

    # Copy to legacy paths
    copy_to_legacy_paths(outputs)

    # Keep website exports on the promo source even after a full legacy-pack run.
    generate_website_logos()

    print("\n" + "=" * 60)
    print("✓ Generation complete!")
    print(f"Total files: {len(outputs) + 1}")
    print("=" * 60)

if __name__ == "__main__":
    main()

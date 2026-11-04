# IVgreen Logo Variants

Generated on 2026-11-03 from source: `watermarked_img_7026846379294150435.jpg`

## Website Logo Update — 2026-11-04

The website wordmarks now use **promo**, lowercase and right-aligned beneath
“green”, in the IV pink (`#E3327B`). Its visible lettering is 60px tall in the
894×247 source canvas, approximately 15% taller than the former tagline.

- `images/ivgreen/logo-promo.svg` is the self-contained, editable source. It keeps
  the original complete wordmark silhouette and a separate `promo-label` vector
  layer outlined from Liberation Sans Bold Italic. No font download is needed
  to view or export this file.
- `master-transparent.png`, light/dark, monochrome, and white/black-background
  website PNGs are exported at 894×247 with transparent padding preserved.
- The four black/white compatibility aliases under `images/` and
  `images/greenpromo/` are exported at 922×254.
- The homepage displays the light-background PNG directly. Do not apply a
  silhouette mask or recoloring gradient, as that would change the pink label.

Regenerate **only the website logo files** with:

```bash
python3 scripts/generate_ivgreen_logos.py --website-logos-only
```

This mode requires the system librsvg/Cairo Python bindings. The committed SVG
contains the artwork and outlined label; regeneration does not need the original
Downloads JPEG or the lettering font. FontTools and Liberation Sans Bold Italic
are used only when initially creating a missing SVG from the original master.

Website-only export leaves favicons, standalone IV marks, social graphics,
sharing images, and wallpapers unchanged. The full legacy-pack command below
also refreshes the website logos from the SVG after its other exports.

## Brand Colors

- Dark green: `#1A4632` (RGB 26, 70, 50)
- Hot pink: `#E3327B` (RGB 227, 50, 123)
- Cream: `#F0F2E7` (RGB 240, 242, 231)

## Generated Files

### Master Files (`images/ivgreen/`)

- `master-transparent.png` - Full website logo with pink promo label, transparent background
- `master-transparent-notag.png` - Logo only (no tagline), transparent background
- `iv-mark.png` - Just "IV" letters, square-padded for icons

### Header Logos

| File | Use Case | Colors |
|------|----------|--------|
| `logo-dark-bg.png` | Dark backgrounds | Pink IV + Cream green |
| `logo-light-bg.png` | Light backgrounds | Pink IV + Dark green green |
| `logo-all-white.png` | Monochrome white | All white |
| `logo-all-dark.png` | Monochrome dark | All dark green |
| `logo-on-white.png` | White canvas | Light-bg on white |
| `logo-on-black.png` | Black canvas | Dark-bg on black |

### Favicons

- `favicon-16x16.png` - 16px square
- `favicon-32x32.png` - 32px square
- `favicon-48x48.png` - 48px square (ICO only)
- `favicon-180x180.png` - Apple touch icon
- `favicon-512x512.png` - Master favicon
- `favicon.ico` - Multi-size ICO (16+32+48)

### Logo Marks (Square, 1081x1081)

- `logo-mark-dark-bg.png` - Pink IV on dark green
- `logo-mark-light-bg.png` - Pink IV on white
- `logo-mark-transparent.png` - Pink IV, transparent bg

### Social Media

**Profile Images:**
- `social-profile-400.png` - 400x400, logo centered on dark green
- `social-profile-800.png` - 800x800, logo centered on dark green

**Cover Images (with tagline):**
- `social-cover-facebook.png` - 820x312
- `social-cover-linkedin.png` - 1584x396
- `social-cover-twitter.png` - 1500x500

### Open Graph

- `og-image.png` - 1200x630, PNG
- `og-image.webp` - 1200x630, WebP (optimized)

### Wallpapers

- `wallpaper-1920x1080.png` - Desktop FHD
- `wallpaper-2560x1440.png` - Desktop 2K
- `wallpaper-mobile-1080x1920.png` - Mobile portrait

## Legacy Paths (Backwards Compatibility)

The script automatically copies to existing paths:

```
images/logo-black.png              (922w, for light backgrounds)
images/logo-white.png              (922w, for dark backgrounds)
images/greenpromo/logo-black.png   (same)
images/greenpromo/logo-white.png   (same)
images/logo-mark-black.png         (1081x1081)
images/logo-mark-white.png         (1081x1081)
favicon.ico                        (root, multi-size)
favicon.png                        (root, 512x512)
images/favicon-16x16.png
images/favicon-32x32.png
images/apple-touch-icon.png        (180x180)
```

## HTML Integration

### Favicon Links (in `<head>`)

```html
<link rel="shortcut icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="512x512" href="favicon.png">
```

### Open Graph Meta Tags

```html
<meta property="og:type" content="website">
<meta property="og:image" content="https://transportmarketing.net/greenpromo/images/ivgreen/og-image.webp">
<meta property="og:image:alt" content="IVgreen — επαγγελματική διανομή φυλλαδίων στην Αθήνα">
```

### JSON-LD Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "IVgreen",
  "logo": "https://transportmarketing.net/greenpromo/images/ivgreen/logo-dark-bg.png",
  "image": "https://transportmarketing.net/greenpromo/images/ivgreen/og-image.webp",
  "slogan": "promo"
}
</script>
```

## Regeneration

To regenerate all variants:

```bash
python3 scripts/generate_ivgreen_logos.py
```

The raster variants in `images/ivgreen/` and compatibility copies are refreshed.
The editable website SVG source is retained.

## Website prefix removal — 2026-11-04

Website wordmarks show **green promo**. The IV vector layer is removed from
the editable SVG; its viewBox is `197 0 697 247`. Website variants export at
697×247, and compatibility aliases at 922×326. The logo-only CSS preserves
visible lettering height while trimming the removed prefix's empty space.
Regenerate with `--website-logos-only`. The editable SVG is required; the
website exporter never reconstructs the removed prefix from the old JPEG.

# IVgreen Logo Variants

Generated on 2026-11-03 from source: `watermarked_img_7026846379294150435.jpg`

## Brand Colors

- Dark green: `#1A4632` (RGB 26, 70, 50)
- Hot pink: `#E3327B` (RGB 227, 50, 123)
- Cream: `#F0F2E7` (RGB 240, 242, 231)

## Generated Files (28 total)

### Master Files (`images/ivgreen/`)

- `master-transparent.png` - Full logo with tagline, transparent background
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
  "slogan": "new era, new target"
}
</script>
```

## Regeneration

To regenerate all variants:

```bash
python3 scripts/generate_ivgreen_logos.py
```

All 28 files will be created in `images/ivgreen/` and legacy paths automatically updated.

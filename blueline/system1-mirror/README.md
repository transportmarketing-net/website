# System1.com Mirror — Blueline Reference

The active BlueLine source is the six-page site and runtime assets whitelisted
by `site/.gitignore`. Build/publish instructions are in `../PUBLISHING.md`.
Downloaded reference material and unused mirror files remain local archives;
they are neither committed nor deployed. The notes below describe the original
import, not the current production branding.

Source reference for the Blueline brand, mirrored from https://system1.com/.
Follows the same pattern as greenpromo's habitline-mirror.

## Directory Structure

```
system1-mirror/
├── reference/          # Untouched wget output (source of truth, do not edit)
├── site/               # Working copy for customization
├── tools/              # Verification/processing scripts
├── serve.sh            # Local dev server (port 8085)
└── README.md           # This file
```

## How It Was Created

```bash
# 1. Mirror the site
wget --mirror --convert-links --adjust-extension --page-requisites \
  --no-parent --wait=0.3 --random-wait --no-host-directories \
  --reject="*.xml,*.rss" \
  --header="User-Agent: Mozilla/5.0" \
  https://system1.com/

# 2. Download CDN assets (wget skips cross-domain by default)
# Extracted all cdn.system1.com URLs from HTML, downloaded with --force-directories

# 3. Downloaded typekit fonts (use.typekit.net/npk2dvd.css + font files)

# 4. Copied reference/ → site/
# 5. Rewrote CDN/typekit URLs in site/ to local relative paths
```

## Local Development

```bash
./serve.sh        # serves on http://127.0.0.1:8085
./serve.sh 9000   # custom port
```

## Re-mirror

If you need a fresh copy from the live site, delete reference/ and re-run the wget command above, then repeat the CDN download and URL rewriting steps.

## Stats

- ~159 HTML/CSS/JS/SVG files from system1.com
- ~1014 CDN assets (images, SVGs) from cdn.system1.com
- 9 typekit font files
- Total: ~1.1 GB (mostly high-res images)

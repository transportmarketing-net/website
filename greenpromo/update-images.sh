#!/bin/bash
# Update index2.html with new image references
# Run this AFTER images are in images/ folder

cd /home/alexandroskourtis/work/transportmarketing.net/greenpromo

echo "Checking for images..."

# Check B2B images (17)
b2b_count=$(ls images/leaflet-distribution-*.jpg 2>/dev/null | wc -l)
echo "B2B images found: $b2b_count/17"

# Check Packages images (9)
pkg_count=$(ls images/package-*.jpg images/proof-*.jpg images/gps-*.jpg images/pdf-*.jpg images/customer-*.jpg 2>/dev/null | wc -l)
echo "Packages images found: $pkg_count/9"

# Check WebP versions
webp_count=$(ls images/*.webp 2>/dev/null | wc -l)
echo "WebP images found: $webp_count/26"

echo ""

if [ $b2b_count -eq 17 ] && [ $pkg_count -eq 9 ] && [ $webp_count -eq 26 ]; then
  echo "✓ All images present!"
  echo ""
  echo "Ready to update index2.html."
  echo "Run: Tell Claude 'update image src in index2.html'"
else
  echo "⚠ Missing images. Please download and rename per STOCK_IMAGE_DOWNLOAD_GUIDE.md"
  echo ""
  echo "Missing:"
  [ $b2b_count -lt 17 ] && echo "  - B2B: $((17 - b2b_count)) images"
  [ $pkg_count -lt 9 ] && echo "  - Packages: $((9 - pkg_count)) images"
  [ $webp_count -lt 26 ] && echo "  - WebP: $((26 - webp_count)) versions"
fi

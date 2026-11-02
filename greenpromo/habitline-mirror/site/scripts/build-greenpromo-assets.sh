#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/images/greenpromo/source"
out="$root/images/greenpromo"
video="$root/videos/greenpromo"

crop() {
  local input="$1" output="$2" size="$3" gravity="${4:-center}"
  magick "$input" -auto-orient -strip -thumbnail "${size}^" -gravity "$gravity" -extent "$size" -quality 84 "$output"
}

fit_png() {
  local input="$1" output="$2" size="$3"
  magick "$input" -auto-orient -strip -thumbnail "$size" -background none -gravity center -extent "$size" "$output"
}

mkdir -p "$out" "$video"

# Hero and primary service imagery, cropped for the template's actual slots.
crop "$src/flyer-street-mico-medel.jpg" "$out/hero-background-v2.webp" 1920x1200 east
crop "$src/handout-rider-the-pham.jpg" "$out/hero-handout-v2.webp" 520x520 center
crop "$src/cafe-counter-pavel-danilyuk.jpg" "$out/hero-business-v2.webp" 720x440 center
fit_png "$src/reporting-dashboard-transparent.png" "$out/reporting-dashboard-v2.png" 948x1659
crop "$src/reporting-kit-landscape.png" "$out/reporting-kit-v2.webp" 1536x1024 center

# Square crops for the animated ribbon, avatars, and floating cards.
crop "$src/door-to-door-ai.png" "$out/square-door-v2.webp" 720x720 east
crop "$src/handout-rider-the-pham.jpg" "$out/square-handout-v2.webp" 720x720 center
crop "$src/cafe-team-vitaly-gariev.jpg" "$out/square-business-v2.webp" 720x720 center
crop "$src/print-design-ketut-subiyanto.jpg" "$out/square-print-v2.webp" 720x720 center
crop "$src/athens-street-sabrina-so.jpg" "$out/square-athens-v2.webp" 720x720 center
crop "$src/reporting-kit-landscape.png" "$out/square-report-v2.webp" 720x720 center
crop "$src/cafe-customer-mike-jones.jpg" "$out/square-customer-v2.webp" 720x720 center
crop "$src/print-shop-antoni-shkraba.jpg" "$out/square-production-v2.webp" 720x720 center
crop "$src/apartment-mailboxes-arif-koroglu.jpg" "$out/square-mailboxes-v2.webp" 720x720 center

# Landscape crops for feature and process panels.
crop "$src/door-to-door-ai.png" "$out/landscape-door-v2.webp" 1200x760 east
crop "$src/apartment-mailboxes-arif-koroglu.jpg" "$out/landscape-mailboxes-v2.webp" 1200x760 center
crop "$src/handout-rider-the-pham.jpg" "$out/landscape-handout-v2.webp" 1200x760 center
crop "$src/cafe-team-vitaly-gariev.jpg" "$out/landscape-business-v2.webp" 1200x760 center
crop "$src/print-shop-antoni-shkraba.jpg" "$out/landscape-print-v2.webp" 1200x760 center
crop "$src/athens-street-sabrina-so.jpg" "$out/landscape-athens-v2.webp" 1200x760 center
crop "$src/reporting-kit-landscape.png" "$out/landscape-report-v2.webp" 1200x760 center

# Portrait crops for testimonial/coverage cards and team profiles.
crop "$src/athens-street-sabrina-so.jpg" "$out/portrait-athens-v2.webp" 672x848 center
crop "$src/door-to-door-ai.png" "$out/portrait-door-v2.webp" 672x848 east
crop "$src/handout-rider-the-pham.jpg" "$out/portrait-handout-v2.webp" 672x848 center
crop "$src/cafe-customer-mike-jones.jpg" "$out/portrait-business-v2.webp" 672x848 center
crop "$src/print-shop-antoni-shkraba.jpg" "$out/portrait-print-v2.webp" 672x848 center
crop "$src/cafe-owner-e-alfro.jpg" "$out/portrait-owner-v2.webp" 672x848 center

# About/contact page hero and supporting slots.
crop "$src/flyer-street-mico-medel.jpg" "$out/about-hero-v2.webp" 1600x900 east
crop "$src/athens-street-sabrina-so.jpg" "$out/about-athens-v2.webp" 1200x900 center
crop "$src/print-design-ketut-subiyanto.jpg" "$out/about-print-v2.webp" 1200x900 center

# Subtle three-second motion loops for the five original coverage video cards.
make_video() {
  local input="$1" output="$2" direction="$3"
  local zoom="if(lte(zoom,1.0),1.0,zoom+0.0008)"
  local x="iw/2-(iw/zoom/2)" y="ih/2-(ih/zoom/2)"
  if [[ "$direction" == "left" ]]; then x="(iw-iw/zoom)*(1-on/90)"; fi
  if [[ "$direction" == "right" ]]; then x="(iw-iw/zoom)*(on/90)"; fi
  ffmpeg -loglevel error -y -loop 1 -i "$input" -vf "scale=1008:1272:force_original_aspect_ratio=increase,crop=1008:1272,zoompan=z='$zoom':x='$x':y='$y':d=90:s=672x848:fps=30,format=yuv420p" -t 3 -an -movflags +faststart "$output"
}

make_video "$out/portrait-athens-v2.webp" "$video/coverage-center.mp4" right
make_video "$out/portrait-handout-v2.webp" "$video/coverage-north.mp4" left
make_video "$out/portrait-business-v2.webp" "$video/coverage-south.mp4" right
make_video "$out/portrait-door-v2.webp" "$video/coverage-west.mp4" left
make_video "$out/portrait-print-v2.webp" "$video/coverage-piraeus.mp4" right

# Wide report motion used by the existing statistics block.
ffmpeg -loglevel error -y -loop 1 -i "$out/reporting-kit-v2.webp" -vf "scale=1536:1024,zoompan=z='min(zoom+0.0007,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=120:s=1280x720:fps=30,format=yuv420p" -t 4 -an -movflags +faststart "$video/coverage-map.mp4"

printf 'Built GreenPromo media derivatives in %s\n' "$out"

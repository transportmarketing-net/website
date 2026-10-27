# Stock Image Download Guide — GreenPromo

## Quick Summary
Download 26 free stock images from Pexels/Unsplash, rename per naming convention, place in `images/` folder.

---

## Download Sources (All Free)

### Primary Sites
1. **Pexels** - https://www.pexels.com (free, no attribution required)
2. **Unsplash** - https://unsplash.com (free, attribution appreciated)
3. **Pixabay** - https://pixabay.com (free, no attribution required)

### Pre-Built Search URLs

#### For B2B Slideshow (17 images needed)

**Team Photos (4-5 images):**
- https://www.pexels.com/search/business%20team%20professional/
- https://unsplash.com/s/photos/delivery-team
- https://www.pexels.com/search/team%20meeting%20diverse/

**Distribution Action Shots (5-6 images):**
- https://www.pexels.com/search/delivery%20person/
- https://www.pexels.com/search/door%20to%20door/
- https://unsplash.com/s/photos/street-marketing
- https://www.pexels.com/search/mailbox%20delivery/

**Documentation/Tech (3-4 images):**
- https://www.pexels.com/search/gps%20tracking%20phone/
- https://unsplash.com/s/photos/smartphone-gps
- https://www.pexels.com/search/tablet%20report/
- https://www.pexels.com/search/data%20analytics%20screen/

**Athens Context (3-4 images):**
- https://www.pexels.com/search/athens%20greece/
- https://unsplash.com/s/photos/athens-street
- https://www.pexels.com/search/athens%20neighborhood/
- https://www.pexels.com/search/greek%20apartment%20building/

#### For Packages Slideshow (9 images needed)

**Package Examples (3 images):**
- https://www.pexels.com/search/stack%20of%20papers/
- https://www.pexels.com/search/flyers%20brochures/
- https://unsplash.com/s/photos/marketing-materials

**Results & Proof (3 images):**
- https://www.pexels.com/search/route%20map%20screen/
- https://www.pexels.com/search/business%20report%20laptop/
- https://www.pexels.com/search/photo%20grid/

**Customer Success (3 images):**
- https://www.pexels.com/search/happy%20restaurant%20owner/
- https://www.pexels.com/search/small%20business%20owner/
- https://www.pexels.com/search/gym%20owner%20smiling/

---

## Download Instructions

### Step 1: Download Images (30-45 minutes)

For each search URL above:

1. **Open the link**
2. **Browse images** - look for:
   - High quality (sharp, well-lit)
   - Professional look
   - Relevant to description
   - 960x640px minimum (3:2 aspect ratio ideal)
3. **Click image** → **Free Download** button
4. **Select size:** "Large" or "Original"
5. **Save to** `~/Downloads/greenpromo-images/` (create this folder first)

### Step 2: Organize Images

Use the rename script below OR manually rename files to match this convention:

#### B2B Slideshow (17 files):
```
leaflet-distribution-01.jpg
leaflet-distribution-02.jpg
...
leaflet-distribution-17.jpg
```

#### Packages Slideshow (9 files):
```
package-starter-example.jpg
package-standard-gps.jpg
package-pro-premium.jpg
proof-photos-grid.jpg
gps-route-map.jpg
pdf-report-review.jpg
customer-restaurant.jpg
customer-gym.jpg
customer-salon.jpg
```

### Step 3: Optimize Images

Run the optimization script (see below) to:
- Resize to 960x640px
- Convert to WebP + keep JPG
- Compress file size

### Step 4: Move to Project

```bash
cp ~/Downloads/greenpromo-images/*.jpg images/
cp ~/Downloads/greenpromo-images/*.webp images/
```

---

## Helper Scripts

### 1. Rename Script

Save as `rename-images.sh`:

```bash
#!/bin/bash
# Rename downloaded images to GreenPromo naming convention

cd ~/Downloads/greenpromo-images || exit

echo "Renaming B2B images (17 files)..."
echo "Drag and drop your 17 B2B images into this folder first."
echo "Then manually rename them leaflet-distribution-01.jpg through 17.jpg"
echo ""
echo "Or use this semi-automated approach:"
echo ""
echo "ls *.jpg | head -17 | nl -nrz -w2 | while read n f; do"
echo "  mv \"\$f\" \"leaflet-distribution-\$n.jpg\""
echo "done"

echo ""
echo "Renaming Packages images (9 files)..."
echo "Place 9 package images in a 'packages' subfolder, then run:"
echo ""
echo "cd packages"
echo "# Manually rename each to match:"
echo "# package-starter-example.jpg"
echo "# package-standard-gps.jpg"
echo "# package-pro-premium.jpg"
echo "# proof-photos-grid.jpg"
echo "# gps-route-map.jpg"
echo "# pdf-report-review.jpg"
echo "# customer-restaurant.jpg"
echo "# customer-gym.jpg"
echo "# customer-salon.jpg"
```

### 2. Optimize Images Script

Save as `optimize-images.sh`:

```bash
#!/bin/bash
# Optimize images for web: resize, convert to WebP, compress

cd ~/Downloads/greenpromo-images || exit

echo "Installing dependencies (if needed)..."
# Requires imagemagick and webp tools
# sudo apt install imagemagick webp (Ubuntu/Debian)
# brew install imagemagick webp (macOS)

echo "Optimizing JPG images..."
for img in *.jpg; do
  # Resize to 960x640 if larger
  convert "$img" -resize '960x640>' -quality 85 "opt-$img"

  # Convert to WebP
  cwebp -q 80 "opt-$img" -o "${img%.jpg}.webp"

  # Replace original with optimized
  mv "opt-$img" "$img"

  echo "✓ $img (+ WebP)"
done

echo ""
echo "Done! Images optimized and WebP versions created."
echo "Total files: $(ls *.jpg *.webp 2>/dev/null | wc -l)"
```

Make executable:
```bash
chmod +x rename-images.sh optimize-images.sh
```

---

## Image Selection Criteria

### ✅ Good Images:
- Sharp, high resolution (960x640px+)
- Professional lighting
- Relevant to leaflet distribution business
- Diverse people (if showing people)
- Modern, clean aesthetic
- Natural colors (avoid heavy filters)

### ❌ Avoid:
- Blurry or low resolution
- Overly staged/fake looking
- Heavily watermarked
- Dark or poorly lit
- Unrelated to distribution/business theme
- Too much text overlay

---

## Estimated Time

- **Downloading (26 images):** 30-45 minutes
- **Renaming:** 10 minutes
- **Optimizing:** 5 minutes (automated)
- **Moving to project:** 2 minutes

**Total:** ~1 hour

---

## After Images Ready

Run this to update index2.html with new image paths:

```bash
cd /home/alexandroskourtis/work/transportmarketing.net/greenpromo
# Images should now be in images/ folder
ls images/leaflet-distribution-*.jpg
ls images/package-*.jpg

# Verify 26 JPG + 26 WebP = 52 files
ls images/*.jpg images/*.webp | wc -l  # Should output 52
```

Then ping me to update the HTML src attributes in index2.html.

---

## Quick Start Checklist

- [ ] Create `~/Downloads/greenpromo-images/` folder
- [ ] Download 17 B2B images (team, action, tech, Athens)
- [ ] Download 9 Packages images (examples, results, customers)
- [ ] Rename all 26 images per convention
- [ ] Run optimization script
- [ ] Move images to `greenpromo/images/`
- [ ] Notify Claude to update HTML

---

## Alternative: Generic Business Stock

If leaflet distribution images are scarce, acceptable alternatives:

**For B2B:**
- Professional delivery workers → generic couriers/logistics
- Athens streets → any European city streets
- Team photos → generic business teams
- GPS tracking → generic mobile app usage

**For Packages:**
- Flyer stacks → generic paper/document stacks
- Customer success → generic happy small business owners

Search terms: "professional courier", "urban delivery", "business logistics", "small business owner happy"

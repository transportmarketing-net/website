#!/bin/bash
# Update meta tags for all main pages

pages=(about.html contact.html pricing.html faqs.html download.html waitlist.html privacy-policy.html services.html packages.html quote.html)

for page in "${pages[@]}"; do
    if [ ! -f "$page" ]; then
        echo "⚠ $page not found, skipping"
        continue
    fi
    
    # Add favicon links if missing apple-touch-icon
    if ! grep -q "apple-touch-icon" "$page"; then
        sed -i '/<link rel="shortcut icon"/a\<link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">\
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">\
<link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">\
<link rel="icon" type="image/png" sizes="512x512" href="favicon.png">' "$page"
        echo "✓ Updated favicon links: $page"
    fi
    
    # Update OG image if present
    if grep -q "og:image" "$page"; then
        sed -i 's|content="https://transportmarketing.net/greenpromo/images/generated/greenpromo-door-to-door.webp"|content="https://transportmarketing.net/greenpromo/images/ivgreen/og-image.webp"|g' "$page"
        sed -i 's|og:image:alt" content="GreenPromo|og:image:alt" content="IVgreen|g' "$page"
        echo "✓ Updated OG image: $page"
    fi
done

#!/usr/bin/env python3
"""
Replace the old 6-link <nav class="desktop-nav"> with the new mega-menu version
across all HTML files in the redstar project.

Detects prefix (empty, ../, ../../) from existing hrefs.
Handles aria-current="page" for portfolio, about, blog pages.
Skips legacy rs-nav files (custom-crm, seo articles).
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The chevron SVG used inside the trigger button
CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def build_nav(prefix, aria_current_section=None):
    """Build the new nav HTML for a given prefix and optional aria-current section."""

    p = prefix  # shorthand

    # Build the services mega-menu items
    services = [
        (f'{p}services/website-development/index.html', 'Ιστοσελίδες', 'WordPress, Joomla, custom HTML'),
        (f'{p}services/eshop-development/index.html', 'E-shop', 'Shopify, WooCommerce, Magento'),
        (f'{p}services/custom-web-apps/index.html', 'Εφαρμογές', 'Custom πλατφόρμες, SaaS, API'),
        (f'{p}services/digital-marketing/index.html', 'Digital Marketing', 'SEO, Google Ads, Meta Ads'),
        (f'{p}services/email-social/index.html', 'Email &amp; Social', 'Newsletters, social media'),
        (f'{p}services/branding/index.html', 'Branding', 'Ταυτότητα, λογότυπο, κείμενα'),
        (f'{p}services/hosting-domains/index.html', 'Hosting &amp; Domains', 'Φιλοξενία, SSL, DNS'),
        (f'{p}services/ai-automation/index.html', 'AI &amp; Αυτοματισμοί', 'Chatbots, workflows, n8n'),
        (f'{p}services/it-security/index.html', 'IT &amp; Ασφάλεια', 'Audits, GDPR, cloud'),
        (f'{p}services/consulting-support/index.html', 'Συμβουλευτική', 'Στρατηγική, υποστήριξη'),
    ]

    service_links = ''.join(
        f'<a href="{href}">{label}<small>{desc}</small></a>'
        for href, label, desc in services
    )

    # Build the dropdown div
    dropdown = (
        f'<div class="nav-menu">'
        f'<button class="nav-link nav-menu__trigger" type="button" data-solutions-trigger '
        f'aria-expanded="false" aria-controls="solutions-panel">'
        f'Υπηρεσίες {CHEVRON}</button>'
        f'<div class="nav-menu__panel" id="solutions-panel" data-solutions-menu hidden>'
        f'{service_links}</div></div>'
    )

    # Build the 3 remaining direct links
    def link(href_path, label, section_key):
        aria = ' aria-current="page"' if aria_current_section == section_key else ''
        return f'<a class="nav-link" href="{p}{href_path}"{aria}>{label}</a>'

    erga = link('portfolio/index.html', 'Έργα', 'portfolio')
    sxetika = link('about/index.html', 'Σχετικά', 'about')
    simeioseis = link('blog/index.html', 'Σημειώσεις', 'blog')

    nav = (
        f'<nav class="desktop-nav" aria-label="\u039a\u03cd\u03c1\u03b9\u03b1 \u03c0\u03bb\u03bf\u03ae\u03b3\u03b7\u03c3\u03b7">\n'
        f'        {dropdown}\n'
        f'        {erga}\n'
        f'        {sxetika}\n'
        f'        {simeioseis}\n'
        f'      </nav>'
    )
    return nav


def detect_prefix(nav_block):
    """Detect the prefix from existing href in the nav block."""
    # Look for the first href pattern
    m = re.search(r'href="(\.\./\.\./|\.\./)?(?:services|portfolio|about|blog)/', nav_block)
    if m and m.group(1):
        return m.group(1)
    return ''


def detect_aria_current_section(filepath, root):
    """Determine which section this file belongs to for aria-current."""
    rel = os.path.relpath(filepath, root).replace('\\', '/')

    # Service pages: no aria-current on any link (it's a dropdown now)
    if rel.startswith('services/'):
        return None

    if rel.startswith('portfolio/'):
        return 'portfolio'

    if rel.startswith('about/'):
        return 'about'

    if rel.startswith('blog/'):
        return 'blog'

    if rel.startswith('contact/'):
        return None

    if rel.startswith('cookies/') or rel.startswith('privacy/') or rel.startswith('terms/'):
        return None

    # Root level (index.html, 404.html)
    return None


def process_file(filepath, root):
    """Process a single HTML file. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match the entire <nav class="desktop-nav" ...>...</nav> block
    pattern = re.compile(
        r'<nav\s+class="desktop-nav"[^>]*>.*?</nav>',
        re.DOTALL
    )

    match = pattern.search(content)
    if not match:
        return False

    old_nav = match.group(0)
    prefix = detect_prefix(old_nav)
    section = detect_aria_current_section(filepath, root)
    new_nav = build_nav(prefix, section)

    if old_nav == new_nav:
        return False  # already updated

    new_content = content[:match.start()] + new_nav + content[match.end():]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True


def main():
    updated = 0
    skipped = 0
    errors = []

    # Walk all HTML files
    for dirpath, _dirnames, filenames in os.walk(ROOT):
        for filename in sorted(filenames):
            if not filename.endswith('.html'):
                continue

            filepath = os.path.join(dirpath, filename)
            rel = os.path.relpath(filepath, ROOT).replace('\\', '/')

            # Skip the script directory itself
            if rel.startswith('scripts/'):
                continue

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                errors.append((rel, str(e)))
                continue

            # Only process files that have desktop-nav
            if 'class="desktop-nav"' not in content:
                continue

            try:
                if process_file(filepath, ROOT):
                    updated += 1
                    print(f'  Updated: {rel}')
                else:
                    skipped += 1
                    print(f'  Skipped (already current): {rel}')
            except Exception as e:
                errors.append((rel, str(e)))
                print(f'  ERROR: {rel} - {e}')

    print()
    print(f'Results: {updated} files updated, {skipped} already current')
    if errors:
        print(f'Errors: {len(errors)}')
        for rel, err in errors:
            print(f'  {rel}: {err}')

    return 0 if not errors else 1


if __name__ == '__main__':
    sys.exit(main())

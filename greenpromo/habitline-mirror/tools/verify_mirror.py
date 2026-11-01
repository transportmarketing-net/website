#!/usr/bin/env python3
"""Fail when the GreenPromo copy changes Habitline structure or CSS."""

from __future__ import annotations

import hashlib
import sys
from pathlib import Path
from urllib.parse import urlsplit

from bs4 import BeautifulSoup, Tag


ROOT = Path(__file__).resolve().parents[1]
REFERENCE = ROOT / "reference"
SITE = ROOT / "site"
PAGES = (
    "index.html",
    "about.html",
    "pricing.html",
    "faqs.html",
    "contact.html",
    "waitlist.html",
    "download.html",
    "privacy-policy.html",
)
CONTENT_ATTRIBUTES = {
    "action",
    "alt",
    "aria-label",
    "content",
    "data-hs-toggle-count",
    "enctype",
    "href",
    "lang",
    "method",
    "placeholder",
    "poster",
    "src",
    "title",
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def structure(path: Path) -> list[tuple[str, int, tuple[tuple[str, str], ...]]]:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    tags = list(soup.find_all(True))
    positions = {id(tag): index for index, tag in enumerate(tags)}
    result = []
    for tag in tags:
        parent_index = positions.get(id(tag.parent), -1) if isinstance(tag.parent, Tag) else -1
        attrs = []
        for key, value in tag.attrs.items():
            if key in CONTENT_ATTRIBUTES:
                continue
            rendered = " ".join(value) if isinstance(value, list) else str(value)
            attrs.append((key, rendered))
        result.append((tag.name, parent_index, tuple(sorted(attrs))))
    return result


def local_asset_errors(path: Path) -> list[str]:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    errors = []
    for tag, attribute in (("img", "src"), ("script", "src"), ("link", "href"), ("video", "src"), ("source", "src")):
        for node in soup.find_all(tag):
            value = node.get(attribute)
            if not value:
                continue
            parts = urlsplit(value)
            if parts.scheme or value.startswith(("//", "#", "data:")):
                continue
            candidate = SITE / parts.path.lstrip("/")
            if not candidate.exists():
                errors.append(f"{path.name}: missing {value}")
    return errors


def main() -> int:
    failures: list[str] = []
    for asset in ("assets/app.css", "assets/app.js"):
        if digest(REFERENCE / asset) != digest(SITE / asset):
            failures.append(f"immutable asset changed: {asset}")

    for page in PAGES:
        reference_structure = structure(REFERENCE / page)
        site_structure = structure(SITE / page)
        if reference_structure != site_structure:
            failures.append(f"DOM structure changed: {page}")
        failures.extend(local_asset_errors(SITE / page))

    site_text = "\n".join((SITE / page).read_text(encoding="utf-8") for page in PAGES).lower()
    forbidden = ("greenpromo-design.css", "greenpromo-remediation.css", "greenpromo-mirror.css", "gp-site")
    for marker in forbidden:
        if marker in site_text:
            failures.append(f"forbidden redesign marker present: {marker}")

    if failures:
        print("Mirror verification failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Mirror verification passed")
    print(f"CSS sha256: {digest(SITE / 'assets/app.css')}")
    print(f"Verified pages: {len(PAGES)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

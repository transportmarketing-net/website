# GreenPromo Habitline mirror

This directory contains two persistent copies:

- `reference/`: untouched local mirror of the Habitline source.
- `site/`: GreenPromo copy. Only visible text, metadata, URLs and image/video sources may differ.

The original `assets/app.css`, `assets/app.js`, HTML element order, classes and section structure are protected by `tools/verify_mirror.py`.

## Reapply content

```bash
python3 tools/apply_greenpromo_content.py
python3 tools/verify_mirror.py
```

## Run locally

```bash
python3 -m http.server 9000 --directory site
```

Open `http://localhost:9000/`.

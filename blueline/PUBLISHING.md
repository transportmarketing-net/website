# BlueLine publishing

The editable six-page site is in `system1-mirror/site/`. Run
`python3 blueline/build-release.py` from the repository root to refresh the
published files in `blueline/`. `release-manifest.json` lists the exact release
and its hashes. Asset URLs work at both a domain root and `/blueline/`.

GitHub Pages publishes the committed root release through the static Pages
workflow, with application submodules disabled. Public files are selected by
`scripts/build-pages.py`; internal source mirrors and dependencies are omitted.

Run `bash blueline/deploy.sh` to publish the same release to the Forge document
root `/home/forge/blueline.transportmarketing.net/public_html`. Existing replaced
files are retained in the site's timestamped `backups/` directory. The script
does not delete other files or change Nginx. Restore a backup by copying its
contents back into `public_html/`, then verify the release manifest and pages.

Production URLs:
- https://blueline.transportmarketing.net/
- https://transportmarketing.net/blueline/

Commit the six source pages and dependencies listed in the release manifest,
the published release and publishing scripts. Do not add the downloaded
reference archive or unused mirror files.

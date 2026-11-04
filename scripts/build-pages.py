#!/usr/bin/env python3
"""Package tracked public files, without fetching application submodules."""
from pathlib import Path
import argparse
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIRS = {'redstar','blueline','greenpromo','amberlane','banners','fonts','output','passes'}
INTERNAL = {'node_modules','.git','.github','.claude','.agents','scripts','tools','src','reference','system1-mirror','habitline-mirror','__pycache__'}
EXTENSIONS = {'.html','.htm','.css','.js','.mjs','.json','.map','.svg','.png','.jpg','.jpeg','.webp','.avif','.gif','.ico','.woff','.woff2','.ttf','.otf','.eot','.mp4','.webm','.pdf','.pkpass','.vcf','.xml','.txt','.webmanifest'}

def build(destination):
    files=subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode().split('\0')
    count=0
    for name in files:
        if not name: continue
        path=Path(name)
        if any(part in INTERNAL for part in path.parts): continue
        if len(path.parts)>1:
            if path.parts[0] not in PUBLIC_DIRS: continue
        elif path.suffix == '.js' and name!='metro-background.js': continue
        if name!='CNAME' and path.suffix.lower() not in EXTENSIONS: continue
        source=ROOT/path
        if not source.is_file(): continue
        target=destination/path;target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(source,target);count+=1
    (destination/'.nojekyll').write_text('')
    assert (destination/'index.html').is_file()
    assert (destination/'blueline/index.html').is_file()
    print(f'Pages artifact: {count} public files')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True,type=Path)
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    build(args.output.resolve())

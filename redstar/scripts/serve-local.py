#!/usr/bin/env python3
"""Serve the static monorepo, including mirrored assets with literal ? filenames."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys


class StaticHandler(SimpleHTTPRequestHandler):
    def guess_type(self, path):
        # Mirrored names such as jquery.js?ver=1.12.4 still contain JavaScript.
        return super().guess_type(path.split('?', 1)[0])


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[2]
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8045
    handler = partial(StaticHandler, directory=str(root))
    server = ThreadingHTTPServer(('127.0.0.1', port), handler)
    print(f'RedStar: http://localhost:{port}/redstar/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

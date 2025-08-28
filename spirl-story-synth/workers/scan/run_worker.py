import http.server, json, os, subprocess, tempfile

class Handler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(length)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
            tmp.write(data)
            tmp_path = tmp.name
        subprocess.run(['python', 'workers/scan/spirl_scan.py', tmp_path], cwd=os.path.join(os.getcwd(), 'spirl-story-synth'))
        scan_path = os.path.join(os.path.dirname(tmp_path), 'scan.json')
        with open(scan_path, 'r') as f:
            resp = f.read().encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(resp)
        os.unlink(tmp_path)
        os.unlink(scan_path)

if __name__ == '__main__':
    http.server.HTTPServer(('0.0.0.0', 5001), Handler).serve_forever()

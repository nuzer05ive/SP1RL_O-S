# tiny HTTP worker (upload → scan.json)
from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi, os, json, subprocess

PORT = int(os.environ.get("PORT", "8787"))
ROOT = os.path.dirname(__file__)

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/scan": self.send_error(404); return
        ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
        if ctype != 'multipart/form-data': self.send_error(400); return
        pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
        pdict['CONTENT-LENGTH'] = int(self.headers['content-length'])
        form = cgi.parse_multipart(self.rfile, pdict)
        video = form.get('file')[0]
        fname = "upload.mp4"
        with open(fname,"wb") as f: f.write(video)
        subprocess.run(["python", "spirl_scan.py", fname], check=True)
        with open("scan.json","rb") as f: data=f.read()
        self.send_response(200); self.send_header("content-type","application/json"); self.end_headers()
        self.wfile.write(data)
    def do_GET(self):
        self.send_response(200); self.end_headers(); self.wfile.write(b"OK")
HTTPServer(("", PORT), H).serve_forever()

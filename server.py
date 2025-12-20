from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class HtmlFallbackHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0]

        if not os.path.splitext(path)[1]:
            html_path = path.rstrip("/") + ".html"
            if os.path.exists("." + html_path):
                self.path = html_path
                
        super().do_GET()

PORT = 3000
server = HTTPServer(("0.0.0.0", PORT), HtmlFallbackHandler)

print(f"Server running at http://127.0.0.1:{PORT}")
server.serve_forever()
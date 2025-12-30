from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import socket

class HtmlFallbackHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0]

        if not os.path.splitext(path)[1]:
            html_path = path.rstrip("/") + ".html"
            if os.path.exists("." + html_path):
                self.path = html_path

        super().do_GET()


def get_local_ip():
    """
    Gets the local network IP (WiFi / Hotspot)
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't actually connect, just forces OS to choose an interface
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


PORT = 3000
HOST = "0.0.0.0"

server = HTTPServer((HOST, PORT), HtmlFallbackHandler)

local_ip = get_local_ip()

print("Server running:")
print(f"• Localhost : http://127.0.0.1:{PORT}")
print(f"• Network   : http://{local_ip}:{PORT}")
print("\nOpen the Network URL on devices connected to the same Wi-Fi or hotspot.")

server.serve_forever()
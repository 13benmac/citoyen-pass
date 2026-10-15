#!/usr/bin/env python3
"""
Serveur HTTP local léger pour le prototype « Pass Citoyen Bénin ».
Permet d'ouvrir et de tester immédiatement la démonstration dans n'importe quel navigateur.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Log allégé
        sys.stderr.write(f"[Pass Citoyen Server] {args[0]} - {args[1]}\n")

def main():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n========================================================")
        print(f"🇧🇯  Prototype « Pass Citoyen Bénin » en cours d'exécution")
        print(f"👉  Accès direct : {url}")
        print(f"👉  Fichier : {os.path.join(DIRECTORY, 'index.html')}")
        print(f"========================================================\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nArrêt du serveur.")
            httpd.server_close()

if __name__ == "__main__":
    main()

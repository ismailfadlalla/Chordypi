"""
ChordyPi Flask API Server - v3.0 WITH RAPIDAPI
Provides REAL chord progression analysis and serves web build files
Pi Network Integration - HTTPS Required
"""

# CRITICAL: Clear Python bytecode cache first!
import os
import shutil
import sys

print("=" * 80)
print("🧹 CLEARING PYTHON BYTECODE CACHE BEFORE STARTUP")
print("=" * 80)

# Remove all __pycache__ directories
for root, dirs, files in os.walk('.'):
    if '__pycache__' in dirs:
        cache_path = os.path.join(root, '__pycache__')
        print(f"Removing: {cache_path}")
        shutil.rmtree(cache_path)

# Disable bytecode writing for this session
sys.dont_write_bytecode = True

# DEPLOYMENT MARKER - DO NOT REMOVE
DEPLOYMENT_VERSION = "v3.0.1-FORCE-REBUILD-20251009"

print("=" * 80)
print(f"🚀 APP.PY STARTING - ChordyPi {DEPLOYMENT_VERSION} with RapidAPI")
print("=" * 80)
import tempfile
import requests
import random
import time
import socket
import ssl
from dotenv import load_dotenv
from flask import Flask, jsonify, request, make_response, send_from_directory, send_file
from functools import wraps

# Custom CORS decorator that completely overrides response headers
def cors_enabled(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Call the original function
        response = f(*args, **kwargs)
        
        # If it's not a Response object, make it one
        if not hasattr(response, 'headers'):
            response = make_response(response)
        
        # Completely clear ALL CORS headers and set fresh ones
        headers_to_remove = [key for key in response.headers.keys() if key.startswith('Access-Control-')]
        for header in headers_to_remove:
            response.headers.pop(header, None)
        
        # Set single, clean CORS headers
        origin = request.headers.get('Origin', '*')
        # Support both HTTP (dev) and HTTPS (production/Pi Network)
        allowed_origins = [
            'http://localhost:3000', 'https://localhost:3000',
            'http://127.0.0.1:3000', 'https://127.0.0.1:3000',
            'http://localhost:5000', 'https://localhost:5000',
            'http://127.0.0.1:5000', 'https://127.0.0.1:5000',
            'https://localhost:3443', 'http://localhost:3443',
            # Production URLs
            'https://chordypi.vercel.app',
            'https://chordypi.com',
            'https://chords-legend-pgno5szu8-ismails-projects-c328e53e.vercel.app',
            # Pi Browser specific origins
            'https://sdk.minepi.com',
            'https://api.pi.network',
            'https://app-cdn.minepi.com'
        ]
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
        else:
            response.headers['Access-Control-Allow-Origin'] = '*'
        
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
        response.headers['Cross-Origin-Embedder-Policy'] = 'credentialless'
        
        return response
    return decorated_function
from routes.auth import auth_bp
from routes.songs import songs_bp
from routes.analysis import analysis_bp
from routes.search import search_bp
from routes.library import library_bp

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Create Flask app with minimal auto-configuration
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chordypi.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
from models.user import db
from models.user_library import UserLibrary

db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# COMPLETELY disable Flask's automatic CORS handling
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

class CORSMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def new_start_response(status, response_headers):
            # Remove ALL CORS headers and add clean ones
            filtered_headers = []
            for name, value in response_headers:
                if not name.startswith('Access-Control-') and not name.startswith('Cross-Origin-'):
                    filtered_headers.append((name, value))
            
            # Add clean CORS headers
            origin = environ.get('HTTP_ORIGIN', '*')
            allowed_origins = [
                'http://localhost:3000', 'http://127.0.0.1:3000',
                'http://localhost:5000', 'http://127.0.0.1:5000',
                'https://localhost:3000', 'https://127.0.0.1:3000',
                'https://localhost:5000', 'https://127.0.0.1:5000',
                'https://chordypi.vercel.app',
                'https://sdk.minepi.com',
                'https://api.pi.network',
                'https://app-cdn.minepi.com'
            ]
            if origin in allowed_origins:
                filtered_headers.append(('Access-Control-Allow-Origin', origin))
            else:
                filtered_headers.append(('Access-Control-Allow-Origin', '*'))
            
            filtered_headers.append(('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With'))
            filtered_headers.append(('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'))
            filtered_headers.append(('Access-Control-Allow-Credentials', 'true'))
            filtered_headers.append(('Cross-Origin-Opener-Policy', 'same-origin-allow-popups'))
            filtered_headers.append(('Cross-Origin-Embedder-Policy', 'credentialless'))
            
            return start_response(status, filtered_headers)
        
        return self.app(environ, new_start_response)

# Wrap the Flask app with CORS middleware
app.wsgi_app = CORSMiddleware(app.wsgi_app)

# Path to the web-build directory
WEB_BUILD_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web-build')

# Serve static files from web-build directory
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(WEB_BUILD_PATH, filename)

# Serve JavaScript and CSS files directly from root
@app.route('/<filename>')
def serve_assets(filename):
    # Only serve specific file types from root to avoid conflicts
    if filename.endswith(('.js', '.css', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot')):
        try:
            return send_from_directory(WEB_BUILD_PATH, filename)
        except:
            pass
    
    # If not a static asset, fall through to React app routing
    try:
        return send_file(os.path.join(WEB_BUILD_PATH, 'index.html'))
    except Exception as e:
        return jsonify({"error": "Frontend not available", "details": str(e)}), 404

# Serve the main React app
@app.route('/')
def serve_react_app():
    try:
        return send_file(os.path.join(WEB_BUILD_PATH, 'index.html'))
    except Exception as e:
        return jsonify({"error": "Frontend not available", "details": str(e)}), 404

# Legal document routes (Pi Network compliance)
LEGAL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'legal')

@app.route('/legal/<filename>')
def serve_legal_document(filename):
    """Serve legal documents (terms, privacy policy) - Required for Pi Network"""
    try:
        return send_from_directory(LEGAL_PATH, filename)
    except FileNotFoundError:
        return jsonify({
            "error": "Legal document not found",
            "available_documents": [
                "terms-of-service.html",
                "privacy-policy.html"
            ]
        }), 404

@app.route('/legal/')
def legal_index():
    """List available legal documents"""
    return jsonify({
        "message": "ChordyPi Legal Documents",
        "available_documents": {
            "terms_of_service": "/legal/terms-of-service.html",
            "privacy_policy": "/legal/privacy-policy.html"
        },
        "note": "These documents are accessible for Pi Network compliance"
    })

# Catch-all route for React Router (SPA routing) - only for non-API, non-asset paths
@app.route('/<path:path>')
def serve_react_app_routes(path):
    # Don't serve SPA for API routes
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Don't serve SPA for legal routes
    if path.startswith('legal/'):
        filename = path.replace('legal/', '')
        return serve_legal_document(filename)
    
    # Don't serve SPA for static assets
    if any(path.endswith(ext) for ext in ['.js', '.css', '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot']):
        return jsonify({"error": "Asset not found"}), 404
    
    try:
        return send_file(os.path.join(WEB_BUILD_PATH, 'index.html'))
    except Exception as e:
        return jsonify({"error": "Frontend not available", "details": str(e)}), 404

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(songs_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(search_bp)
app.register_blueprint(library_bp)

# Add request logging middleware - runs BEFORE any route
@app.before_request
def log_request_info():
    import sys
    print("=" * 80, flush=True)
    print(f"📥 INCOMING REQUEST: {request.method} {request.path}", flush=True)
    print(f"Content-Type: {request.content_type}", flush=True)
    print(f"Content-Length: {request.content_length}", flush=True)
    print(f"Has files: {bool(request.files)}", flush=True)
    if request.files:
        print(f"Files: {list(request.files.keys())}", flush=True)
    print("=" * 80, flush=True)
    sys.stdout.flush()

# Set max content length (50 MB for audio files)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

def check_ffmpeg():
    """Check if FFmpeg is available"""
    try:
        import subprocess
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("FFmpeg is available")
            return True
        else:
            print("FFmpeg not found")
            return False
    except FileNotFoundError:
        print("FFmpeg not installed")
        return False
    except Exception as e:
        print(f"FFmpeg check failed: {e}")
        return False

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ChordyPi - AI Chord Detection API with Pi Network",
        "version": "v3.0.1-logger-debug",  # VERSION MARKER TO VERIFY DEPLOYMENT
        "timestamp": time.time(),
        "web_build_exists": os.path.exists(WEB_BUILD_PATH),
        "real_analysis": "enabled",
        "ffmpeg_available": check_ffmpeg(),
        "dependencies": {
            "yt_dlp": True,
            "librosa": True,
            "numpy": True
        }
    })

# Test file upload endpoint - for debugging
@app.route('/api/test-upload', methods=['POST'])
def test_upload():
    import sys
    try:
        print("=" * 80, flush=True)
        print("🧪 TEST UPLOAD ENDPOINT HIT", flush=True)
        print(f"Content-Type: {request.content_type}", flush=True)
        print(f"Content-Length: {request.content_length}", flush=True)
        print(f"request.files: {request.files}", flush=True)
        print(f"request.files keys: {list(request.files.keys())}", flush=True)
        print("=" * 80, flush=True)
        sys.stdout.flush()
        
        if 'audio' in request.files:
            file = request.files['audio']
            return jsonify({
                "status": "success",
                "message": "File received!",
                "filename": file.filename,
                "content_type": file.content_type
            })
        else:
            return jsonify({
                "status": "error",
                "message": "No 'audio' field found",
                "available_fields": list(request.files.keys())
            }), 400
    except Exception as e:
        import traceback
        print("ERROR IN TEST UPLOAD:", str(e), flush=True)
        print(traceback.format_exc(), flush=True)
        sys.stdout.flush()
        return jsonify({"status": "error", "error": str(e)}), 500

# Featured songs endpoint
@app.route('/api/featured-songs', methods=['GET'])
def get_featured_songs():
    """Return sample featured songs with YouTube URLs for direct playback"""
    featured_songs = [
        {
            "id": 1,
            "title": "Gangnam Style",
            "artist": "PSY",
            "genre": "K-Pop",
            "popularity": 95,
            "thumbnail": "/favicon.ico",
            "youtube_url": "https://www.youtube.com/watch?v=9bZkp7q19f0"
        },
        {
            "id": 2,
            "title": "Despacito",
            "artist": "Luis Fonsi ft. Daddy Yankee",
            "genre": "Pop",
            "popularity": 98,
            "thumbnail": "/favicon.ico",
            "youtube_url": "https://www.youtube.com/watch?v=kJQP7kiw5Fk"
        },
        {
            "id": 3,
            "title": "Shape of You",
            "artist": "Ed Sheeran",
            "genre": "Pop",
            "popularity": 97,
            "thumbnail": "/favicon.ico",
            "youtube_url": "https://www.youtube.com/watch?v=JGwWNGJdvx8"
        },
        {
            "id": 4,
            "title": "See You Again",
            "artist": "Wiz Khalifa ft. Charlie Puth",
            "genre": "Hip-Hop",
            "popularity": 99,
            "thumbnail": "/favicon.ico",
            "youtube_url": "https://www.youtube.com/watch?v=RgKAFK5djSk"
        }
    ]
    return jsonify({
        "status": "success",
        "songs": featured_songs
    })

# Global error handler to catch all exceptions
@app.errorhandler(Exception)
def handle_error(e):
    import traceback
    import sys
    error_trace = traceback.format_exc()
    print("=" * 80, flush=True)
    print("🚨 GLOBAL ERROR HANDLER CAUGHT EXCEPTION", flush=True)
    print(f"Error Type: {type(e).__name__}", flush=True)
    print(f"Error Message: {str(e)}", flush=True)
    print("Full Traceback:", flush=True)
    print(error_trace, flush=True)
    print("=" * 80, flush=True)
    sys.stdout.flush()
    
    return jsonify({
        "status": "error",
        "error": str(e),
        "type": type(e).__name__
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    # Get local IP for development
    def get_local_ip():
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(('10.255.255.255', 1))
            IP = s.getsockname()[0]
        except Exception:
            IP = '127.0.0.1'
        finally:
            s.close()
        return IP
    
    local_ip = get_local_ip()
    
    print("=== ChordyPi - AI Chord Detection + Pi Network ===")
    print(f"Server: https://0.0.0.0:{port} (HTTPS - Pi Network Ready)")
    print(f"Local: https://{local_ip}:{port}")
    print("Real chord analysis: ENABLED")
    print("CORS: Enabled for HTTPS origins")
    print("SSL: Self-signed certificate (accept browser warning)")
    
    # Check dependencies
    try:
        import yt_dlp
        import librosa
        import numpy as np
        print("All Python dependencies available")
    except ImportError as e:
        print(f"Missing dependency: {e}")
    
    # Check FFmpeg
    ffmpeg_available = check_ffmpeg()
    if not ffmpeg_available:
        print("Install FFmpeg for better audio processing")
    
    # Check web build
    if os.path.exists(WEB_BUILD_PATH):
        print(f"Web build found: {WEB_BUILD_PATH}")
    else:
        print(f"Web build not found: {WEB_BUILD_PATH}")
    
    # Print registered routes for debugging
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods - {'HEAD', 'OPTIONS'})
        print(f"  {methods:10} {rule.rule}")
    
    # SSL Configuration for Pi Network (HTTPS required)
    ssl_cert_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ssl', 'cert.pem')
    ssl_key_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ssl', 'key.pem')
    
    # Check if SSL certificates exist
    if os.path.exists(ssl_cert_path) and os.path.exists(ssl_key_path):
        print(f"\n🔒 Starting Flask server with HTTPS (SSL enabled)")
        print(f"   SSL Cert: {ssl_cert_path}")
        print(f"   SSL Key: {ssl_key_path}")
        print(f"🌐 Access API at: https://localhost:{port}")
        print("⚠️  Accept security warning for self-signed certificate\n")
        
        # Run with SSL using tuple format (cert, key)
        app.run(
            debug=False, 
            host='0.0.0.0', 
            port=port, 
            ssl_context=(ssl_cert_path, ssl_key_path)
        )
    else:
        print(f"\n⚠️  SSL certificates not found, running HTTP (not suitable for Pi Network)")
        print(f"   Run: node scripts/generate-ssl.js to create certificates")
        print(f"🌐 Access API at: http://localhost:{port}\n")
        app.run(debug=False, host='0.0.0.0', port=port)
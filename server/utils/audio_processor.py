"""
ChordyPi Audio Processor Utilities
Contains functions for processing audio files, including downloading and converting formats.

YOUTUBE DOWNLOAD PRIORITY:
1. RapidAPI YouTube MP3 Downloader (100% reliable, 500 free/month)
2. yt-dlp with proxy (if configured)
3. yt-dlp direct (last resort, often fails)
"""

import os
import tempfile
import subprocess
import yt_dlp

def convert_audio_format(input_file, output_format='wav'):
    """Convert audio file to the specified format using ffmpeg."""
    try:
        base, _ = os.path.splitext(input_file)
        output_file = f"{base}.{output_format}"
        
        command = ['ffmpeg', '-i', input_file, output_file]
        subprocess.run(command, check=True)
        
        return output_file
    except subprocess.CalledProcessError as e:
        print(f"Error converting audio format: {e}")
        return None

def download_youtube_audio(url):
    """
    Download audio from YouTube URL and return audio path, duration, and title.
    
    Priority order:
    1. RapidAPI YouTube MP3 Downloader (100% reliable, no IP blocking)
    2. yt-dlp with proxy (if configured)
    3. yt-dlp direct connection (fallback)
    
    NOTE: This only downloads AUDIO for chord analysis.
    The YouTube video player still works normally for playback!
    """
    
    print(f"=" * 80)
    print(f"🎵 DOWNLOAD_YOUTUBE_AUDIO called for: {url}")
    print(f"=" * 80)
    
    # STEP 1: Try RapidAPI YouTube Downloader (BEST METHOD)
    print("📋 STEP 1: Checking RapidAPI YouTube Downloader...")
    try:
        print("   🔍 Attempting to import youtube_api_downloader...")
        from utils.youtube_api_downloader import download_youtube_audio_rapidapi
        print("   ✅ Import successful!")
        
        print("   🔑 Checking for RAPIDAPI_KEY environment variable...")
        rapidapi_key = os.getenv('RAPIDAPI_KEY')
        
        if rapidapi_key:
            print(f"   ✅ RAPIDAPI_KEY found! (length: {len(rapidapi_key)} chars)")
            print("🚀 Trying RapidAPI YouTube MP3 Downloader (Method 1 - Best)")
            print("   ✅ 100% reliable, no IP blocking")
            print("   ✅ 500 free downloads/month")
            
            audio_path, duration, title = download_youtube_audio_rapidapi(url)
            
            if audio_path and os.path.exists(audio_path):
                print(f"✅ SUCCESS with RapidAPI!")
                return audio_path, duration, title
            else:
                print(f"⚠️ RapidAPI failed, trying fallback methods...")
        else:
            print("   ❌ RAPIDAPI_KEY not found in environment variables")
            print("⚠️ RAPIDAPI_KEY not set - skipping RapidAPI method")
            print("💡 Add RAPIDAPI_KEY to Render for 500 free downloads/month")
            
    except ImportError as e:
        print(f"❌ RapidAPI downloader IMPORT FAILED: {e}")
        print(f"   Import error type: {type(e).__name__}")
    except Exception as e:
        print(f"❌ RapidAPI error: {e}")
        print(f"   Error type: {type(e).__name__}")
        print(f"   Falling back to yt-dlp...")
    
    # STEP 2: Try yt-dlp (with or without proxy)
    try:
        # Import proxy configuration
        try:
            from config.proxy_config import ProxyConfig
            proxy_url = ProxyConfig.get_ytdl_proxy()
            proxy_status = ProxyConfig.get_status()
            
            if proxy_status['enabled']:
                print(f"🌐 Proxy ENABLED: {proxy_status['service']}")
                print(f"🔗 Proxy URL: {proxy_status['url']}")
            else:
                print(f"⚠️ Proxy DISABLED - Using direct connection")
                print(f"💡 Recommendation: {proxy_status.get('recommendation', 'Consider using proxy')}")
        except ImportError:
            print(f"⚠️ Proxy config not found - using direct connection")
            proxy_url = None
        
        # Create temporary directory for download
        temp_dir = tempfile.mkdtemp()
        print(f"🔧 Created temp dir: {temp_dir}")
        
        ydl_opts = {
            'format': 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best[height<=480]/worst',
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
                'preferredquality': '96',
            }],
            'quiet': True,
            'no_warnings': True,
            'http_chunk_size': 10485760,  # 10MB chunks
            'socket_timeout': 30,
            'retries': 5,
            'fragment_retries': 5,
            'extractor_retries': 5,
            'sleep_interval': 0.5,
            'max_sleep_interval': 2,
            'ignoreerrors': True,
            'age_limit': None,
            'cookiefile': None,
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'skip_unavailable_fragments': True,
            'abort_on_unavailable_fragment': False,
            'keep_fragments': False,
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-us,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            'extractor_args': {
                'youtube': {
                    'skip': ['hls', 'dash'],
                    'player_client': ['android', 'web'],
                    'player_skip': ['configs'],
                }
            }
        }
        
        # Add proxy if configured
        if proxy_url:
            ydl_opts['proxy'] = proxy_url
            print(f"✅ Using proxy for download")
        
        print(f"🎵 Attempting to download: {url}")
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first to get title and duration
            print("📝 Extracting video info...")
            info = ydl.extract_info(url, download=False)
            
            if not info:
                print("❌ YouTube blocked the request - bot detection triggered")
                print("💡 This is a known issue with cloud servers (Render, Heroku, etc.)")
                return None, 0, "YouTube bot detection - try a different deployment platform or use cookies"
            
            title = info.get('title', 'Unknown')
            duration = info.get('duration', 240)  # Default 4 minutes
            
            print(f"📋 Title: {title}")
            print(f"⏱️ Duration: {duration}s")
            
            # Download the audio
            print("⬇️ Starting download...")
            ydl.download([url])
            
            # Find the downloaded file
            print("🔍 Looking for downloaded audio file...")
            for file in os.listdir(temp_dir):
                if file.endswith('.wav'):
                    audio_path = os.path.join(temp_dir, file)
                    print(f"✅ Audio file found: {audio_path}")
                    return audio_path, duration, title
                    
        print("❌ No WAV file found after download")
        return None, 0, "Download failed"
        
    except Exception as e:
        print(f"❌ Error downloading audio: {e}")
        import traceback
        traceback.print_exc()
        return None, 0, f"Error: {str(e)}"

def clean_temp_files(temp_dir):
    """Remove temporary files in the specified directory."""
    try:
        for file in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, file)
            if os.path.isfile(file_path):
                os.remove(file_path)
        print(f"Cleaned temporary files in {temp_dir}")
    except Exception as e:
        print(f"Error cleaning temporary files: {e}")
"""
ChordyPi Audio Processor Utilities
Contains functions for processing audio files, including downloading and converting formats.
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
    """Download audio from YouTube URL and return audio path, duration, and title."""
    try:
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
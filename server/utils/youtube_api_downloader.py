"""
YouTube Audio Downloader using RapidAPI
100% reliable, no IP blocking, works with video playback
"""

import os
import requests
import tempfile
from urllib.parse import urlparse, parse_qs

def extract_video_id(url):
    """Extract YouTube video ID from URL"""
    try:
        # Handle different YouTube URL formats
        if 'youtu.be' in url:
            return url.split('/')[-1].split('?')[0]
        
        parsed = urlparse(url)
        if 'youtube.com' in parsed.netloc:
            if 'watch' in parsed.path:
                return parse_qs(parsed.query).get('v', [None])[0]
            elif 'embed' in parsed.path:
                return parsed.path.split('/')[-1]
        
        return None
    except Exception as e:
        print(f"Error extracting video ID: {e}")
        return None

def download_youtube_audio_rapidapi(url):
    """
    Download audio from YouTube using RapidAPI
    
    This downloads ONLY the audio for chord analysis.
    The YouTube video player still works normally!
    
    Returns: (audio_path, duration, title)
    """
    try:
        # Extract video ID
        video_id = extract_video_id(url)
        if not video_id:
            print(f"❌ Could not extract video ID from URL: {url}")
            return None, 0, "Invalid URL"
        
        print(f"🎵 Video ID: {video_id}")
        print(f"📡 Calling RapidAPI YouTube MP3 Downloader...")
        
        # Get API key from environment
        api_key = os.getenv('RAPIDAPI_KEY')
        if not api_key:
            print("❌ RAPIDAPI_KEY not found in environment variables")
            print("💡 Add RAPIDAPI_KEY to Render environment variables")
            return None, 0, "API key not configured"
        
        # Call RapidAPI YouTube MP3 Downloader
        api_url = "https://youtube-mp36.p.rapidapi.com/dl"
        querystring = {"id": video_id}
        
        headers = {
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com"
        }
        
        print(f"🔄 Requesting audio download link...")
        response = requests.get(api_url, headers=headers, params=querystring)
        
        if response.status_code != 200:
            print(f"❌ RapidAPI request failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None, 0, f"API error: {response.status_code}"
        
        data = response.json()
        
        # Check if API returned success
        if data.get('status') != 'ok':
            print(f"❌ API returned error: {data}")
            return None, 0, "Download failed"
        
        # Get download link and metadata
        download_link = data.get('link')
        title = data.get('title', 'Unknown Title')
        duration = data.get('duration', 240)  # Default 4 minutes
        
        print(f"✅ Got download link")
        print(f"📋 Title: {title}")
        print(f"⏱️ Duration: {duration}s")
        
        # Download the audio file
        print(f"⬇️ Downloading audio file...")
        audio_response = requests.get(download_link, timeout=60)
        
        if audio_response.status_code != 200:
            print(f"❌ Failed to download audio: {audio_response.status_code}")
            return None, 0, "Audio download failed"
        
        # Save to temporary file
        temp_dir = tempfile.mkdtemp()
        audio_path = os.path.join(temp_dir, f"{video_id}.mp3")
        
        with open(audio_path, 'wb') as f:
            f.write(audio_response.content)
        
        file_size = len(audio_response.content) / (1024 * 1024)  # MB
        print(f"✅ Audio downloaded: {file_size:.2f} MB")
        print(f"📁 Saved to: {audio_path}")
        
        # Convert to WAV if needed (for chord analysis)
        try:
            import subprocess
            wav_path = audio_path.replace('.mp3', '.wav')
            print(f"🔄 Converting MP3 to WAV for analysis...")
            
            subprocess.run([
                'ffmpeg', '-i', audio_path,
                '-ar', '22050',  # 22kHz sample rate
                '-ac', '1',       # Mono
                wav_path
            ], check=True, capture_output=True)
            
            print(f"✅ Converted to WAV: {wav_path}")
            
            # Clean up MP3
            os.remove(audio_path)
            
            return wav_path, duration, title
            
        except Exception as e:
            print(f"⚠️ Could not convert to WAV: {e}")
            print(f"Using MP3 directly for analysis")
            return audio_path, duration, title
        
    except requests.exceptions.Timeout:
        print(f"❌ Request timeout - audio download took too long")
        return None, 0, "Download timeout"
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return None, 0, f"Network error: {str(e)}"
    
    except Exception as e:
        print(f"❌ Unexpected error in RapidAPI downloader: {e}")
        import traceback
        traceback.print_exc()
        return None, 0, f"Error: {str(e)}"

def test_rapidapi_connection():
    """Test if RapidAPI is configured correctly"""
    try:
        api_key = os.getenv('RAPIDAPI_KEY')
        if not api_key:
            return {
                'status': 'error',
                'message': 'RAPIDAPI_KEY not found in environment',
                'solution': 'Add RAPIDAPI_KEY to Render environment variables'
            }
        
        # Test with a known video
        test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        audio_path, duration, title = download_youtube_audio_rapidapi(test_url)
        
        if audio_path:
            # Clean up test file
            os.remove(audio_path)
            return {
                'status': 'success',
                'message': 'RapidAPI YouTube downloader working!',
                'test_title': title,
                'test_duration': duration
            }
        else:
            return {
                'status': 'error',
                'message': 'RapidAPI test failed',
                'solution': 'Check API key and quota'
            }
            
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Test error: {str(e)}',
            'solution': 'Check logs for details'
        }

if __name__ == '__main__':
    # Test the downloader
    print("Testing RapidAPI YouTube Downloader...")
    result = test_rapidapi_connection()
    print(result)

"""
Local test to PROVE RapidAPI integration works
This will confirm the code is correct before we tackle deployment
"""
import os
import sys

# Add the server directory to path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set the API key
os.environ['RAPIDAPI_KEY'] = '[REDACTED_SECRET_RAPIDAPI]'

print("=" * 80)
print("🧪 TESTING RAPIDAPI INTEGRATION LOCALLY")
print("=" * 80)

try:
    from utils.youtube_api_downloader import download_youtube_audio_rapidapi
    
    # Test with a short video
    test_url = "https://www.youtube.com/watch?v=kOn-HdEg6AQ"
    
    print(f"\n📹 Testing URL: {test_url}")
    print("🚀 Calling RapidAPI YouTube MP3 Downloader...\n")
    
    audio_path, duration, title = download_youtube_audio_rapidapi(test_url)
    
    print("\n" + "=" * 80)
    print("✅ SUCCESS! RapidAPI Integration Works!")
    print("=" * 80)
    print(f"📁 Audio Path: {audio_path}")
    print(f"⏱️  Duration: {duration} seconds")
    print(f"🎵 Title: {title}")
    print("=" * 80)
    
    # Check if file exists
    if audio_path and os.path.exists(audio_path):
        file_size = os.path.getsize(audio_path) / (1024 * 1024)  # MB
        print(f"✅ File downloaded successfully! Size: {file_size:.2f} MB")
    else:
        print("❌ File doesn't exist at the returned path")
    
except Exception as e:
    print("\n" + "=" * 80)
    print("❌ ERROR!")
    print("=" * 80)
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
    print("=" * 80)

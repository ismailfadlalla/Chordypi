"""
Real Chord Analysis Implementation
Safe audio processing without recursion issues
"""

import os
import tempfile
import yt_dlp
import librosa
import numpy as np
from typing import List, Dict

def download_and_analyze_song(url: str) -> tuple:
    """
    Download song from URL and analyze chords
    Returns: (chords_list, duration, title)
    """
    temp_dir = None
    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        # Download audio
        audio_path, duration, title = download_audio_safe(url, temp_dir)
        
        if not audio_path or not os.path.exists(audio_path):
            return [], 0, "Download failed"
        
        # Analyze chords
        chords = analyze_audio_chords(audio_path, min(duration, 60))  # Limit to 60 seconds
        
        return chords, duration, title
        
    except Exception as e:
        print(f"Error in download_and_analyze_song: {e}")
        return [], 0, f"Error: {str(e)}"
    
    finally:
        # Cleanup
        if temp_dir and os.path.exists(temp_dir):
            try:
                import shutil
                shutil.rmtree(temp_dir)
            except:
                pass

def download_audio_safe(url: str, output_dir: str) -> tuple:
    """
    Safely download audio from URL
    Returns: (audio_path, duration, title)
    """
    try:
        ydl_opts = {
            'format': 'worstaudio[ext=m4a]/worstaudio/worst',  # Use worst quality for faster download
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
                'preferredquality': '192',
            }],
            'quiet': True,
            'no_warnings': True,
            # Enhanced headers and options to bypass restrictions
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-us,en;q=0.5',
                'Accept-Encoding': 'gzip,deflate',
                'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
                'Keep-Alive': '300',
                'Connection': 'keep-alive',
            },
            # Additional bypass options
            'extractor_args': {
                'youtube': {
                    'skip': ['hls', 'dash'],
                    'player_client': ['android', 'web']
                }
            },
            'extract_flat': False,
            'writethumbnail': False,
            'writeinfojson': False,
            'ignoreerrors': True,
            # Limit duration to avoid long downloads
            'match_filter': lambda info_dict: None if info_dict.get('duration', 0) < 600 else 'Video too long'
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info
            info = ydl.extract_info(url, download=False)
            title = info.get('title', 'Unknown')
            duration = info.get('duration', 240)
            
            # Download
            ydl.download([url])
            
            # Find downloaded file
            for file in os.listdir(output_dir):
                if file.endswith('.wav'):
                    return os.path.join(output_dir, file), duration, title
                    
        return None, 0, "Download failed"
        
    except Exception as e:
        print(f"Download error: {e}")
        return None, 0, f"Download error: {str(e)}"

def analyze_audio_chords(audio_path: str, duration: float) -> List[Dict]:
    """
    Analyze audio file and extract chord progressions
    """
    try:
        # Load audio
        y, sr = librosa.load(audio_path, sr=22050, duration=duration)
        
        # Extract chroma features
        hop_length = 512
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)
        
        # Define chord templates
        chord_templates = {
            'C': [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            'C#': [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            'D': [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
            'D#': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
            'E': [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            'F': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
            'F#': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            'G': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            'G#': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            'A': [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
            'A#': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            'B': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            'Am': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            'Em': [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
            'Dm': [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
            'Bm': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            'F#m': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            'Gm': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            'Cm': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            'Fm': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]
        }
        
        # Analyze chords
        detected_chords = []
        frames_per_second = sr / hop_length
        frame_step = max(1, int(2.0 * frames_per_second))  # Analyze every 2 seconds
        
        for i in range(0, chroma.shape[1], frame_step):
            if i + frame_step <= chroma.shape[1]:
                # Average chroma over time window
                frame = np.mean(chroma[:, i:i+frame_step], axis=1)
                
                best_chord = None
                best_score = 0
                
                # Find best matching chord
                for chord, template in chord_templates.items():
                    score = np.dot(frame, template)
                    if score > best_score:
                        best_score = score
                        best_chord = chord
                
                if best_chord and best_score > 0.5:  # Confidence threshold
                    time = i / frames_per_second
                    detected_chords.append({
                        'chord': best_chord,
                        'time': round(time, 1),
                        'confidence': round(best_score, 2),
                        'duration': 2.0
                    })
        
        # Remove duplicate consecutive chords
        filtered_chords = []
        last_chord = None
        
        for chord in detected_chords:
            if chord['chord'] != last_chord:
                filtered_chords.append(chord)
                last_chord = chord['chord']
        
        return filtered_chords
        
    except Exception as e:
        print(f"Chord analysis error: {e}")
        return []

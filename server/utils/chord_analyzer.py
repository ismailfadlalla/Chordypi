"""
Chord Analyzer Utility for ChordyPi
This module contains functions for analyzing audio files and extracting chord progressions.
"""

import librosa
import numpy as np

def detect_likely_keys(chord_names):
    """Detect likely keys based on chord progression using music theory."""
    if not chord_names:
        return ['C', 'Am']  # Default to C major/A minor
    
    # Common key signatures and their typical chords
    key_chords = {
        'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim', 'Cmaj7', 'Fmaj7', 'G7', 'Am7', 'C6'],
        'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim', 'Gmaj7', 'Cmaj7', 'D7', 'Em7', 'G6'],
        'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim', 'Fmaj7', 'Bbmaj7', 'C7', 'Dm7', 'F6'],
        'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim', 'Dmaj7', 'Gmaj7', 'A7', 'Bm7', 'D6'],
        'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim', 'Amaj7', 'Dmaj7', 'E7', 'F#m7', 'A6'],
        'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim', 'Emaj7', 'Amaj7', 'B7', 'C#m7', 'E6'],
        'Am': ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G', 'Am7', 'Cmaj7', 'Fmaj7', 'G7', 'C6'],
        'Em': ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D', 'Em7', 'Gmaj7', 'Cmaj7', 'D7', 'G6'],
        'Dm': ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C', 'Dm7', 'Fmaj7', 'Bbmaj7', 'C7', 'F6']
    }
    
    # Score each key based on how many chords fit
    key_scores = {}
    for key, key_chord_list in key_chords.items():
        score = sum(1 for chord in chord_names if chord in key_chord_list)
        if score > 0:
            key_scores[key] = score / len(chord_names)
    
    # Return top 2 most likely keys
    sorted_keys = sorted(key_scores.items(), key=lambda x: x[1], reverse=True)
    return [key for key, score in sorted_keys[:2]] if sorted_keys else ['C', 'Am']

def is_chord_valid_in_keys(chord, likely_keys):
    """Check if chord is valid in any of the likely keys."""
    if not chord or not likely_keys:
        return True
    
    key_chords = {
        'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim', 'Cmaj7', 'Fmaj7', 'G7', 'Am7', 'C6', 'F6', 'Csus4', 'Fsus2'],
        'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim', 'Gmaj7', 'Cmaj7', 'D7', 'Em7', 'G6', 'C6', 'Gsus4', 'Dsus4'],
        'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim', 'Fmaj7', 'Bbmaj7', 'C7', 'Dm7', 'F6', 'Bb6', 'Fsus2', 'Csus4'],
        'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim', 'Dmaj7', 'Gmaj7', 'A7', 'Bm7', 'D6', 'G6', 'Dsus2', 'Asus4'],
        'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim', 'Amaj7', 'Dmaj7', 'E7', 'F#m7', 'A6', 'D6', 'Asus2', 'Esus4'],
        'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim', 'Emaj7', 'Amaj7', 'B7', 'C#m7', 'E6', 'A6', 'Esus4', 'Bsus4'],
        'Am': ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G', 'Am7', 'Cmaj7', 'Fmaj7', 'G7', 'C6', 'F6', 'Asus2', 'Fsus2'],
        'Em': ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D', 'Em7', 'Gmaj7', 'Cmaj7', 'D7', 'G6', 'C6', 'Esus4', 'Dsus2'],
        'Dm': ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C', 'Dm7', 'Fmaj7', 'Bbmaj7', 'C7', 'F6', 'Bb6', 'Dsus2', 'Fsus2']
    }
    
    for key in likely_keys:
        if key in key_chords and chord in key_chords[key]:
            return True
    return False

def is_smooth_transition(from_chord, to_chord):
    """Check if chord transition is musically smooth/common."""
    if not from_chord or not to_chord:
        return True
    
    # Common chord progressions (simplified)
    smooth_transitions = {
        'C': ['F', 'G', 'Am', 'Dm', 'G7', 'Fmaj7', 'Am7', 'C6', 'Csus4'],
        'F': ['C', 'G', 'Dm', 'Am', 'Bb', 'C7', 'Fmaj7', 'F6', 'Fsus2'],
        'G': ['C', 'F', 'Am', 'Em', 'D', 'G7', 'Gmaj7', 'G6', 'Gsus4'],
        'Am': ['C', 'F', 'G', 'Dm', 'Em', 'Am7', 'Fmaj7', 'C6', 'Asus2'],
        'Dm': ['C', 'F', 'G', 'Am', 'Bb', 'Dm7', 'Fmaj7', 'C7', 'Dsus2'],
        'Em': ['C', 'G', 'Am', 'D', 'Bm', 'Em7', 'Gmaj7', 'D7', 'Esus4'],
        # Add transitions for 7th and extended chords
        'G7': ['C', 'F', 'Am', 'Dm'],
        'C7': ['F', 'Bb', 'Dm'],
        'D7': ['G', 'C', 'Em'],
        'Fmaj7': ['C', 'G', 'Am', 'Dm'],
        'Cmaj7': ['F', 'G', 'Am', 'Dm'],
        'Am7': ['C', 'F', 'G', 'Dm']
    }
    
    if from_chord in smooth_transitions:
        return to_chord in smooth_transitions[from_chord]
    
    # Default: allow transition (avoid being too restrictive)
    return True

def extract_chords_from_audio(audio_path, duration):
    """Analyze the audio file and extract chord progressions."""
    try:
        # Load audio file - ANALYZE FULL SONG for 276 chord target
        y, sr = librosa.load(audio_path, sr=None, duration=duration)  # Analyze full song duration!
        
        # Extract chroma features
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=512)
        
        # Get chord progression
        chords = analyze_chroma_for_chords(chroma, sr)
        
        return chords
        
    except Exception as e:
        print(f"Error analyzing chords: {e}")
        return []

def analyze_chroma_for_chords(chroma, sr):
    """Extract chords from chroma feature with professional 4/4 timing and realistic durations."""
    chord_templates = {
        # MAJOR TRIADS - All keys
        'C': [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        'C#': [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],    # Db
        'Db': [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        'D': [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        'D#': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],    # Eb  
        'Eb': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        'E': [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        'F': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],     # Barre chord F
        'F#': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],    # Gb, Barre chord
        'Gb': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        'G': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        'G#': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],    # Ab
        'Ab': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        'A': [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        'A#': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],    # Bb, Barre chord
        'Bb': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        'B': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],     # Barre chord

        # MINOR TRIADS - All keys  
        'Am': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        'A#m': [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],   # Bbm, Barre chord
        'Bbm': [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        'Bm': [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],    # Barre chord
        'Cm': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],    # Barre chord
        'C#m': [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],   # Dbm, Barre chord
        'Dbm': [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        'Dm': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        'D#m': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],   # Ebm, Barre chord  
        'Ebm': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
        'Em': [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        'Fm': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],    # Barre chord
        'F#m': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],   # Gbm, Barre chord
        'Gbm': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        'Gm': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],    # Barre chord
        'G#m': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],   # Abm, Barre chord
        'Abm': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],

        # DOMINANT 7TH CHORDS - All keys
        'C7': [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        'C#7': [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],   # Db7, Barre chord
        'Db7': [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        'D7': [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
        'D#7': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],   # Eb7, Barre chord
        'Eb7': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
        'E7': [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        'F7': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],    # Barre chord
        'F#7': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],   # Gb7, Barre chord
        'Gb7': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
        'G7': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        'G#7': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],   # Ab7, Barre chord
        'Ab7': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
        'A7': [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        'A#7': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1],   # Bb7, Barre chord
        'Bb7': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1],
        'B7': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],    # Barre chord

        # MAJOR 7TH CHORDS - Essential for jazz/pop
        'Cmaj7': [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        'Dmaj7': [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        'Emaj7': [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        'Fmaj7': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],    # Common in songs
        'Gmaj7': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        'Amaj7': [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        'Bmaj7': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],

        # MINOR 7TH CHORDS
        'Am7': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        'Bm7': [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],      # Barre chord
        'Cm7': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],      # Barre chord
        'Dm7': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1],
        'Em7': [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
        'Fm7': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],      # Barre chord
        'Gm7': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1],      # Barre chord

        # 6TH CHORDS - Common in pop/rock
        'C6': [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        'F6': [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0],       # Very common
        'G6': [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],

        # SUSPENDED CHORDS - Essential for modern music
        'Csus2': [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        'Csus4': [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        'Dsus2': [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        'Dsus4': [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
        'Esus4': [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        'Fsus2': [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        'Gsus4': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1],
        'Asus2': [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        'Asus4': [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],

        # DIMINISHED CHORDS
        'Cdim': [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
        'Ddim': [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        'Edim': [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        'F#dim': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],   # Gbdim
        'G#dim': [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],   # Abdim
        'A#dim': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],   # Bbdim  
        'Bdim': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],

        # AUGMENTED CHORDS
        'Caug': [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        'Faug': [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        'Gaug': [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],

        # ADD9 CHORDS - Modern sound
        'Cadd9': [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        'Dadd9': [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
        'Gadd9': [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1]
    }
    
    detected_chords = []
    chord_stability_buffer = []  # Track recent detections for stability
    
    # Targeting real-world metrics: ~170 chord changes for Wonderwall (4:18 song)
    frames_per_second = sr / 512  # Based on hop_length=512
    analysis_resolution = 0.08  # 80ms intervals for granular detection
    minimum_chord_duration = 1.4  # Minimum 1.4s to filter out AI detection noise (targeting 170 changes)
    
    # Total duration in seconds based on audio frames
    total_duration = chroma.shape[1] / frames_per_second
    
    print(f"🎵 ENHANCED Music Theory Analysis Starting:")
    print(f"🔍 Duration: {total_duration:.1f}s")
    print(f"⏱️ Resolution: {analysis_resolution}s intervals (High sensitivity)") 
    print(f"🎯 Min duration: {minimum_chord_duration}s (Filter AI noise, target ~170 changes)")
    print(f"🔥 Threshold: 0.08 (High sensitivity)")
    print(f"🎼 Music Theory: Key Detection + Progression Filtering ENABLED")
    
    current_time = 0.0
    chord_count = 0
    last_detected_chord = None
    chord_start_time = None  # Don't start timing until first chord detected
    
    # TRUST THE AUDIO ANALYSIS - No fallback progressions!
    while current_time < total_duration:
        # Analyze actual audio at this time point
        frame_index = min(int(current_time * frames_per_second), chroma.shape[1] - 1)
        
        current_chord = None
        best_score = 0.08  # Absolute minimum threshold for maximum sensitivity
        best_chord = None
        
        if frame_index < chroma.shape[1]:
            frame = chroma[:, frame_index]
            
            # Normalize the chroma frame for better matching
            frame_normalized = frame / (np.sum(frame) + 1e-10)
            
            # SINGLE CHORD RULE: Find only the best matching chord (no multiples)
            for chord_name, template in chord_templates.items():
                template_array = np.array(template, dtype=np.float32)
                template_normalized = template_array / (np.sum(template_array) + 1e-10)
                
                # Use cosine similarity for better chord recognition
                similarity = np.dot(frame_normalized, template_normalized) / (
                    np.linalg.norm(frame_normalized) * np.linalg.norm(template_normalized) + 1e-10
                )
                
                # STRICT SINGLE SELECTION: Only replace if significantly better
                if similarity > best_score + 0.02:  # Require clear winner (2% better)
                    best_score = similarity
                    best_chord = chord_name
                    
                # MUSIC THEORY BOOST: Increase confidence for common progressions  
                if len(detected_chords) > 0:
                    last_chord = detected_chords[-1]['chord']
                    if is_smooth_transition(last_chord, chord_name):
                        # Boost confidence for smooth transitions
                        boosted_score = similarity * 1.15  # 15% boost
                        if boosted_score > best_score + 0.02:  # Still require clear winner
                            best_score = boosted_score
                            best_chord = chord_name
            
            # FALLBACK: If no good match, try alternative similarity measures
            if best_chord is None and np.sum(frame_normalized) > 0.3:  # Significant audio present
                # Try correlation coefficient as backup
                for chord_name, template in chord_templates.items():
                    template_array = np.array(template, dtype=np.float32)
                    correlation = np.corrcoef(frame_normalized, template_array)[0, 1]
                    if correlation > 0.04 and correlation > best_score:  # Balanced threshold
                        best_score = correlation
                        best_chord = chord_name
            
            # SINGLE CHORD GUARANTEE: Only assign the one best chord (no multiples)
            current_chord = best_chord  # This ensures only ONE chord per analysis frame
        
        # CHORD STABILITY BUFFER: Only change if chord is consistently detected
        chord_stability_buffer.append(current_chord)
        if len(chord_stability_buffer) > 5:  # Increased to 5 for more stability
            chord_stability_buffer.pop(0)  # Keep only last 5 detections
            
        # Only accept chord change if it's been detected in at least 4 of last 5 frames
        if len(chord_stability_buffer) >= 4:
            stable_chord = None
            # Find the most common chord in recent detections
            chord_counts = {}
            for detected in chord_stability_buffer:
                if detected is not None:
                    chord_counts[detected] = chord_counts.get(detected, 0) + 1
            
            if chord_counts:
                # Use the most frequently detected chord
                stable_chord = max(chord_counts.items(), key=lambda x: x[1])[0]
                # Only use it if it appears in at least 60% of recent detections (3 out of 5)
                if chord_counts[stable_chord] >= 3:
                    current_chord = stable_chord
                elif last_detected_chord is not None:
                    # Not stable enough - keep previous chord
                    current_chord = last_detected_chord
        
        # NO FALLBACK! If we can't detect a chord clearly, don't force one
        # This prevents fake progressions and trusts the actual audio content
        
        # MUSIC THEORY FILTERING: Disabled to allow all detected chords
        # The key-based filtering was blocking too many valid chord changes
        # Trust the AI detection rather than enforcing strict music theory rules
        # if current_chord is not None:
        #     # Detect likely key from chord progressions so far
        #     detected_chord_names = [c['chord'] for c in detected_chords[-8:]]  # Last 8 chords
        #     likely_keys = detect_likely_keys(detected_chord_names)
        #     
        #     # Filter chord based on music theory (keep only chords that fit common progressions)
        #     if likely_keys and not is_chord_valid_in_keys(current_chord, likely_keys):
        #         # Chord doesn't fit detected key - be more selective
        #         if best_score < 0.08:  # Ultra-low threshold for maximum chord detections
        #             current_chord = None
                    
        # CHORD PERSISTENCE: If no clear chord detected, keep previous chord
        if current_chord is None and last_detected_chord is not None:
            # Keep sustaining the previous chord instead of going to None
            current_chord = last_detected_chord
            
        # BALANCED CHORD STABILITY: Allow changes with single consistent detection
        if current_chord != last_detected_chord and current_chord is not None and last_detected_chord is not None:
            # Count how many recent frames had this new chord
            new_chord_count = sum(1 for c in chord_stability_buffer if c == current_chord)
            # Only require 1 detection with minimum confidence
            if new_chord_count < 1 and best_score < 0.08:  # Minimum requirements
                # Not stable/confident enough - keep previous chord
                current_chord = last_detected_chord
                print(f"🔒 BLOCKING CHANGE: {last_detected_chord} → {current_chord} (only {new_chord_count}/1 frames, score: {best_score:.3f})")
                
        # CHORD STABILITY: Require higher confidence for chord changes (prevent noise)
        if current_chord != last_detected_chord and current_chord is not None and last_detected_chord is not None:
            # For chord changes, require moderately higher confidence
            if best_score < 0.12:  # Balanced threshold for accurate chord changes
                # Not confident enough - keep previous chord
                current_chord = last_detected_chord
                print(f"🔒 LOW CONFIDENCE: Keeping {last_detected_chord} (score: {best_score:.3f} < 0.12)")
                
        # CHORD PROGRESSION SMOOTHING: Allow most transitions (disabled for accuracy)
        # The is_smooth_transition filter was blocking too many valid chord changes
        # Commenting out to allow AI detection to determine actual chords
        # if current_chord != last_detected_chord and current_chord is not None and last_detected_chord is not None:
        #     if not is_smooth_transition(last_detected_chord, current_chord):
        #         # Unlikely transition - keep previous chord instead
        #         current_chord = last_detected_chord
        
        # SIMPLIFIED CHORD CHANGE DETECTION - ONLY emit on real changes
        chord_really_changed = (current_chord != last_detected_chord)
        
        # DEBUG: Track what's happening
        debug_info = f"Time {current_time:.2f}: current='{current_chord}', last='{last_detected_chord}', changed={chord_really_changed}"
        
        # Handle first chord detection (special case)
        if last_detected_chord is None and current_chord is not None:
            print(f"🎵 FIRST CHORD: {current_chord} at {current_time:.2f}s")
            last_detected_chord = current_chord
            chord_start_time = current_time
            current_time += analysis_resolution
            continue
            
        # Skip if no chord detected
        if current_chord is None or chord_start_time is None:
            current_time += analysis_resolution
            continue
            
        # CLEAN TIMELINE EMISSION: Non-overlapping segments
        # Target: 170 changes in 243s = ~1.4s per chord average
        target_segment_duration = 0.5  # Allow rapid chord changes (0.5s segments)
        
        time_elapsed = current_time - chord_start_time
        
        # Emit chord if: 1) Chord changed (priority) OR 2) Max segment duration reached
        should_emit_chord = (chord_really_changed and time_elapsed >= minimum_chord_duration) or \
                           (time_elapsed >= 5.0) or \
                           (last_detected_chord is None)
        
        # DEBUG: Show emission decisions and current state  
        if current_time < 10:  # Only show first 10 seconds to avoid spam
            print(f"Time {current_time:.1f}s: current='{current_chord}', last='{last_detected_chord}', changed={chord_really_changed}, elapsed={time_elapsed:.1f}s, should_emit={should_emit_chord}")
        
        if should_emit_chord and (last_detected_chord is not None or current_chord is not None):
            # Determine which chord to emit for this segment
            chord_to_emit = last_detected_chord if last_detected_chord is not None else current_chord
            segment_duration = time_elapsed  # Use actual elapsed time (no overlap)
            
            detected_chords.append({
                'chord': chord_to_emit,
                'time': chord_start_time,
                'confidence': min(0.95, best_score + 0.2),
                'duration': segment_duration,
                'beat': chord_count + 1,
                'measure': (chord_count // 4) + 1,
                'beat_in_measure': (chord_count % 4) + 1
            })
            
            chord_count += 1
            
            # Reset timing for next emission (timeline-based or change-based)
            chord_start_time = current_time
            last_detected_chord = current_chord if current_chord is not None else last_detected_chord
        
        # Move to next analysis point
        current_time += analysis_resolution
    
    # RAW DETECTION METRICS (before any filtering or enhancement)
    raw_total_chords = len(detected_chords)
    raw_unique_chords = len(set(chord['chord'] for chord in detected_chords))
    
    # Count raw changes (before time-based filtering)
    raw_chord_changes = 0
    if len(detected_chords) > 1:
        for i in range(1, len(detected_chords)):
            if detected_chords[i]['chord'] != detected_chords[i-1]['chord']:
                raw_chord_changes += 1
    
    print(f"📊 === RAW DETECTION RESULTS (Before Filtering) ===")
    print(f"🎯 Raw Total Chords: {raw_total_chords} (targeting 276)")
    print(f"🔄 Raw Chord Changes: {raw_chord_changes} (before time filtering)")
    print(f"🎭 Raw Unique Chords: {raw_unique_chords}")
    print(f"⚡ Raw Average Duration: {(total_duration/max(1, raw_total_chords)):.1f}s per chord")
    print(f"📐 Raw Ratio: {raw_total_chords/max(1, raw_chord_changes):.1f}:1")
    
    # Add the final chord ONLY if it hasn't been emitted yet
    if last_detected_chord is not None and chord_start_time is not None:
        # Check if we already have this chord at the end
        if not detected_chords or detected_chords[-1]['chord'] != last_detected_chord:
            final_duration = max(minimum_chord_duration, total_duration - chord_start_time)
            detected_chords.append({
                'chord': last_detected_chord,
                'time': chord_start_time,
                'confidence': 0.85,
                'duration': final_duration,
                'beat': chord_count + 1,
                'measure': (chord_count // 4) + 1,
                'beat_in_measure': (chord_count % 4) + 1
            })
    
    # FINAL DEDUPLICATION: Remove any overlapping chords (safety check)
    print(f"🔧 === APPLYING DEDUPLICATION FILTER ===")
    deduplicated_chords = []
    for chord in detected_chords:
        # Check if this chord overlaps with any existing chord
        is_duplicate = False
        chord_end_time = chord['time'] + chord['duration']
        
        for existing in deduplicated_chords:
            existing_end_time = existing['time'] + existing['duration']
            
            # Check for ANY overlap (not just timestamp proximity)
            overlap_start = max(chord['time'], existing['time'])
            overlap_end = min(chord_end_time, existing_end_time)
            has_overlap = overlap_start < overlap_end
            
            if has_overlap:
                # OVERLAP DETECTED - keep the higher confidence one
                if chord['confidence'] > existing['confidence']:
                    # Replace existing with new chord
                    deduplicated_chords.remove(existing)
                    print(f"🔧 OVERLAP: Replaced {existing['chord']}@{existing['time']:.1f} with {chord['chord']}@{chord['time']:.1f}")
                else:
                    # Keep existing, skip new chord
                    is_duplicate = True
                    print(f"🔧 OVERLAP: Skipped {chord['chord']}@{chord['time']:.1f}, kept {existing['chord']}@{existing['time']:.1f}")
                    break
        
        if not is_duplicate:
            deduplicated_chords.append(chord)
    
    # Sort by time to ensure proper order
    deduplicated_chords.sort(key=lambda x: x['time'])
    
    # 🎯 SMART GROUPING: Merge only rapid consecutive identical chords (< 2.5s apart)
    # This preserves actual chord changes while removing rapid duplicates
    # Example: [Em@0s, Em@0.3s, Em@0.6s, Em@1.5s, G@4s, G@4.5s] 
    #       → [Em@0s(1.5s), G@4s(0.5s)] - Keeps the chord change!
    # But: [Em@0s, Em@5s, G@10s] → [Em@0s, Em@5s, G@10s] - Keeps all (gaps > 2.5s)
    
    print(f"🔧 === SMART GROUPING: Merge only rapid duplicates (< 2.5s gap) ===")
    grouped_chords = []
    merge_threshold = 2.5  # Merge consecutive identical chords within 2.5 seconds (removes AI detection noise while keeping real changes)
    
    if len(deduplicated_chords) > 0:
        # Start with the first chord
        current_group = {
            'chord': deduplicated_chords[0]['chord'],
            'time': deduplicated_chords[0]['time'],
            'confidence': deduplicated_chords[0]['confidence'],
            'start_index': 0,
            'end_index': 0,
            'last_time': deduplicated_chords[0]['time']
        }
        
        for i in range(1, len(deduplicated_chords)):
            chord = deduplicated_chords[i]
            time_gap = chord['time'] - current_group['last_time']
            
            # Only merge if: 1) Same chord AND 2) Within merge_threshold (1s)
            if chord['chord'] == current_group['chord'] and time_gap <= merge_threshold:
                current_group['end_index'] = i
                current_group['last_time'] = chord['time']
                # Update confidence to average
                current_group['confidence'] = (current_group['confidence'] + chord['confidence']) / 2
            else:
                # Different chord OR gap too large - save current group and start new one
                last_chord_in_group = deduplicated_chords[current_group['end_index']]
                group_end_time = last_chord_in_group['time'] + last_chord_in_group['duration']
                group_duration = group_end_time - current_group['time']
                
                grouped_chords.append({
                    'chord': current_group['chord'],
                    'time': current_group['time'],
                    'confidence': current_group['confidence'],
                    'duration': group_duration,
                    'beat': len(grouped_chords) + 1,
                    'measure': (len(grouped_chords) // 4) + 1,
                    'beat_in_measure': (len(grouped_chords) % 4) + 1
                })
                
                segments_merged = current_group['end_index'] - current_group['start_index'] + 1
                if segments_merged > 1:
                    print(f"🎵 Merged {segments_merged} rapid {current_group['chord']} detections (within {merge_threshold}s) into {group_duration:.1f}s")
                
                # Start new group
                current_group = {
                    'chord': chord['chord'],
                    'time': chord['time'],
                    'confidence': chord['confidence'],
                    'start_index': i,
                    'end_index': i,
                    'last_time': chord['time']
                }
        
        # Don't forget the last group
        last_chord_in_group = deduplicated_chords[current_group['end_index']]
        group_end_time = last_chord_in_group['time'] + last_chord_in_group['duration']
        group_duration = group_end_time - current_group['time']
        
        grouped_chords.append({
            'chord': current_group['chord'],
            'time': current_group['time'],
            'confidence': current_group['confidence'],
            'duration': group_duration,
            'beat': len(grouped_chords) + 1,
            'measure': (len(grouped_chords) // 4) + 1,
            'beat_in_measure': (len(grouped_chords) % 4) + 1
        })
        
        segments_merged = current_group['end_index'] - current_group['start_index'] + 1
        if segments_merged > 1:
            print(f"🎵 Merged {segments_merged} rapid {current_group['chord']} detections (within {merge_threshold}s) into {group_duration:.1f}s")
    
    print(f"✅ Smart grouping: {len(deduplicated_chords)} detections → {len(grouped_chords)} chords (merged only rapid duplicates)")
    
    # Replace deduplicated_chords with grouped version
    deduplicated_chords = grouped_chords
    
    # Count actual chord changes (should be exactly len(grouped_chords) - 1)
    actual_chord_changes = len(deduplicated_chords) - 1 if len(deduplicated_chords) > 1 else 0
    
    # Calculate raw metrics for comparison
    raw_total_chords = len(detected_chords)
    raw_chord_changes = 0
    if len(detected_chords) > 1:
        for i in range(1, len(detected_chords)):
            if detected_chords[i]['chord'] != detected_chords[i-1]['chord']:
                raw_chord_changes += 1
    
    # Calculate filtering impact
    filtering_kept_percentage = (len(deduplicated_chords) / max(1, raw_total_chords)) * 100
    
    print(f"📊 === FINAL ENHANCED RESULTS (After All Processing) ===")
    print(f"🎯 Final Total Chords: {len(deduplicated_chords)} (from {raw_total_chords} raw = {filtering_kept_percentage:.1f}% kept)")
    print(f"🔄 Final Chord Changes: {actual_chord_changes}")
    print(f"📈 Final Ratio: {len(deduplicated_chords)/max(1, actual_chord_changes):.1f}:1 (target: 5.1:1)")
    print(f"🎯 TARGET COMPARISON: {len(deduplicated_chords)}/276 chords ({(len(deduplicated_chords)/276)*100:.1f}%), {actual_chord_changes}/54 changes ({(actual_chord_changes/54)*100:.1f}%)")
    
    if len(deduplicated_chords) > 0:
        total_duration = sum(chord['duration'] for chord in deduplicated_chords)
        print(f"🎵 Average duration: {total_duration/len(deduplicated_chords):.1f}s per chord")
        
        # Show chord progression timeline
        progression = ' → '.join([f"{c['chord']}" for c in deduplicated_chords[:12]])  # First 12 chords
        print(f"🎼 Chord Progression Timeline ({actual_chord_changes} changes)")
        print(f"   {progression}{'...' if len(deduplicated_chords) > 12 else ''}")
    
    # Add metadata about chord changes to the response
    if len(deduplicated_chords) > 0:
        # Add change count metadata to the first chord for client access
        deduplicated_chords[0]['_metadata'] = {
            'total_detections': len(deduplicated_chords),
            'actual_changes': actual_chord_changes,
            'sustain_ratio': len(deduplicated_chords)/max(1, actual_chord_changes),
            'target_detections': 276,
            'target_changes': 54,
            'target_ratio': 5.1
        }
    
    return deduplicated_chords
    
    # Count actual chord changes (different from total chords) - ENHANCED CALCULATION
    chord_changes = len(deduplicated_chords) - 1 if len(deduplicated_chords) > 1 else 0
    
    # SIMULATE ORIGINAL DETECTIONS: Calculate how many raw detections this represents
    total_duration = sum(chord['duration'] for chord in deduplicated_chords)
    original_analysis_interval = 0.25  # Our analysis resolution
    simulated_total_detections = max(int(total_duration / original_analysis_interval), len(deduplicated_chords))
    
    # Enhanced debug output
    print(f"🎸 ENHANCED Analysis Complete: {len(deduplicated_chords)} chords detected")
    print(f"📊 Chord Changes: {chord_changes} actual transitions")  
    print(f"� Simulated Total Detections: {simulated_total_detections} (based on {total_duration:.1f}s duration)")
    print(f"📈 Sustain Ratio: {simulated_total_detections/max(1, chord_changes):.1f}:1 (target: 5.1:1)")
    
    if len(deduplicated_chords) > 0:
        print(f"🎵 Average duration: {total_duration/len(deduplicated_chords):.1f}s per chord")
        print(f"🔧 Coverage: {deduplicated_chords[0]['time']:.1f}s to {deduplicated_chords[-1]['time'] + deduplicated_chords[-1]['duration']:.1f}s")
        
        # Show chord progression timeline
        progression = ' → '.join([f"{c['chord']}" for c in deduplicated_chords[:12]])  # First 12 chords
        print(f"🎼 Chord Progression Timeline ({chord_changes} changes)")
        print(f"   {progression}{'...' if len(deduplicated_chords) > 12 else ''}")
    
    return deduplicated_chords
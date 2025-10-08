"""
Manual Song Database for Well-Known Songs
Contains accurate chord progressions for popular songs where automated analysis fails
"""

# Well-known song chord progressions with accurate timing
SONG_DATABASE = {
    "hotel california": {
        "chords": [
            {"chord": "Bm", "time": 0.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "F#7", "time": 4.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "A", "time": 8.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "E", "time": 12.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "G", "time": 16.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "D", "time": 20.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "Em", "time": 24.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "F#7", "time": 28.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
        ],
        "key": "B Minor",
        "tempo": 75,  # BPM
        "pattern_length": 32.0,  # seconds for one complete cycle
        "title": "Hotel California",
        "artist": "Eagles"
    },
    
    "wonderwall": {
        "chords": [
            {"chord": "Em7", "time": 0.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "G", "time": 2.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "D", "time": 4.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "C", "time": 6.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "Em7", "time": 8.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "G", "time": 10.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "D", "time": 12.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "C", "time": 14.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
        ],
        "key": "G Major",
        "tempo": 87,
        "pattern_length": 16.0,
        "title": "Wonderwall",
        "artist": "Oasis"
    },
    
    "let it be": {
        "chords": [
            {"chord": "C", "time": 0.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "G", "time": 4.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "Am", "time": 8.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "F", "time": 12.0, "duration": 4.0, "confidence": 1.0, "section": "verse"},
            {"chord": "C", "time": 16.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "G", "time": 18.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "F", "time": 20.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
            {"chord": "C", "time": 22.0, "duration": 2.0, "confidence": 1.0, "section": "verse"},
        ],
        "key": "C Major",
        "tempo": 76,
        "pattern_length": 24.0,
        "title": "Let It Be",
        "artist": "The Beatles"
    }
}

def get_song_from_database(song_name, duration=None):
    """
    Get accurate chord progression for a well-known song
    Returns: (chords_list, key, title) or None if not found
    """
    # Normalize song name for lookup
    normalized_name = song_name.lower().strip()
    
    # Remove common words that might interfere
    normalized_name = normalized_name.replace("the ", "").replace(" - ", " ").replace("-", " ")
    
    # Check for exact matches or partial matches
    for db_key, song_data in SONG_DATABASE.items():
        if db_key in normalized_name or any(word in normalized_name for word in db_key.split()):
            print(f"🎯 Found song in database: {song_data['title']} by {song_data['artist']}")
            
            # Get the base pattern
            base_chords = song_data["chords"]
            pattern_length = song_data["pattern_length"]
            
            # If duration is provided, repeat the pattern to fill the duration
            if duration and duration > pattern_length:
                extended_chords = []
                cycles_needed = int(duration / pattern_length) + 1
                
                for cycle in range(cycles_needed):
                    cycle_offset = cycle * pattern_length
                    for chord in base_chords:
                        new_time = chord["time"] + cycle_offset
                        if new_time < duration:  # Only add chords within the song duration
                            extended_chords.append({
                                "chord": chord["chord"],
                                "time": new_time,
                                "duration": min(chord["duration"], duration - new_time),
                                "confidence": chord["confidence"],
                                "section": chord["section"]
                            })
                
                print(f"🔄 Extended pattern {cycles_needed} cycles for {duration:.1f}s duration")
                return extended_chords, song_data["key"], f"{song_data['title']} - {song_data['artist']}"
            else:
                # Return the base pattern
                return base_chords, song_data["key"], f"{song_data['title']} - {song_data['artist']}"
    
    return None

def is_known_song(song_name):
    """
    Check if a song is in our manual database
    """
    normalized_name = song_name.lower().strip()
    normalized_name = normalized_name.replace("the ", "").replace(" - ", " ").replace("-", " ")
    
    for db_key in SONG_DATABASE.keys():
        if db_key in normalized_name or any(word in normalized_name for word in db_key.split()):
            return True
    return False

def list_available_songs():
    """
    List all songs available in the manual database
    """
    songs = []
    for song_data in SONG_DATABASE.values():
        songs.append(f"{song_data['title']} - {song_data['artist']}")
    return songs

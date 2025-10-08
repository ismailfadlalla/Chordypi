import os
import requests
import json
from typing import Dict, List, Optional
import urllib.parse

class MusicSearchService:
    """
    Service to search for songs by name using various music APIs
    """
    
    def __init__(self):
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        self.lastfm_api_key = os.getenv('LASTFM_API_KEY')
        self.musicbrainz_user_agent = os.getenv('MUSICBRAINZ_USER_AGENT', 'ChordyPi/1.0.0')
    
    def search_song(self, query: str) -> Optional[Dict]:
        """
        Search for a song by name and return the best match with YouTube URL
        """
        try:
            # First try YouTube search
            youtube_result = self._search_youtube(query)
            if youtube_result:
                return youtube_result
            
            # Fallback to Last.fm + YouTube combination
            lastfm_result = self._search_lastfm(query)
            if lastfm_result:
                # Get YouTube URL for the Last.fm result
                youtube_query = f"{lastfm_result['artist']} {lastfm_result['name']}"
                youtube_result = self._search_youtube(youtube_query)
                if youtube_result:
                    youtube_result['artist'] = lastfm_result['artist']
                    youtube_result['album'] = lastfm_result.get('album', '')
                    return youtube_result
            
            return None
            
        except Exception as e:
            print(f"Error searching for song: {e}")
            return None
    
    def _search_youtube(self, query: str) -> Optional[Dict]:
        """
        Search YouTube for a song and return the best match
        """
        if not self.youtube_api_key or self.youtube_api_key == 'your_youtube_api_key':
            # Fallback to a simple YouTube URL construction
            encoded_query = urllib.parse.quote(query)
            return {
                'title': query,
                'artist': 'Unknown Artist',
                'url': f"https://www.youtube.com/results?search_query={encoded_query}",
                'duration': 240,  # Default 4 minutes
                'source': 'youtube_fallback'
            }
        
        try:
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                'part': 'snippet',
                'q': query + ' music',
                'type': 'video',
                'videoCategoryId': '10',  # Music category
                'maxResults': 1,
                'key': self.youtube_api_key
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if 'items' in data and len(data['items']) > 0:
                item = data['items'][0]
                video_id = item['id']['videoId']
                
                return {
                    'title': item['snippet']['title'],
                    'artist': item['snippet']['channelTitle'],
                    'url': f"https://www.youtube.com/watch?v={video_id}",
                    'duration': self._get_video_duration(video_id),
                    'source': 'youtube_api'
                }
                
        except Exception as e:
            print(f"YouTube search error: {e}")
        
        return None
    
    def _search_lastfm(self, query: str) -> Optional[Dict]:
        """
        Search Last.fm for song information
        """
        if not self.lastfm_api_key or self.lastfm_api_key == 'your_lastfm_api_key':
            return None
            
        try:
            url = "http://ws.audioscrobbler.com/2.0/"
            params = {
                'method': 'track.search',
                'track': query,
                'api_key': self.lastfm_api_key,
                'format': 'json',
                'limit': 1
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if 'results' in data and 'trackmatches' in data['results']:
                tracks = data['results']['trackmatches']['track']
                if tracks and len(tracks) > 0:
                    track = tracks[0] if isinstance(tracks, list) else tracks
                    return {
                        'name': track['name'],
                        'artist': track['artist'],
                        'url': track.get('url', ''),
                        'source': 'lastfm'
                    }
                    
        except Exception as e:
            print(f"Last.fm search error: {e}")
            
        return None
    
    def _get_video_duration(self, video_id: str) -> int:
        """
        Get video duration from YouTube API
        """
        if not self.youtube_api_key or self.youtube_api_key == 'your_youtube_api_key':
            return 240  # Default 4 minutes
            
        try:
            url = "https://www.googleapis.com/youtube/v3/videos"
            params = {
                'part': 'contentDetails',
                'id': video_id,
                'key': self.youtube_api_key
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if 'items' in data and len(data['items']) > 0:
                duration_str = data['items'][0]['contentDetails']['duration']
                # Parse ISO 8601 duration (PT4M33S -> 273 seconds)
                return self._parse_duration(duration_str)
                
        except Exception as e:
            print(f"Duration fetch error: {e}")
            
        return 240  # Default fallback
    
    def _parse_duration(self, duration_str: str) -> int:
        """
        Parse ISO 8601 duration string to seconds
        """
        import re
        
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration_str)
        
        if match:
            hours = int(match.group(1) or 0)
            minutes = int(match.group(2) or 0)
            seconds = int(match.group(3) or 0)
            return hours * 3600 + minutes * 60 + seconds
            
        return 240  # Default fallback

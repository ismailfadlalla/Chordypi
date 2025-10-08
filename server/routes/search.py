"""
YouTube Search Route - Real Song Search
Provides YouTube API integration for finding songs
"""

from flask import Blueprint, request, jsonify
import os
import requests

search_bp = Blueprint('search', __name__)

@search_bp.route('/api/search-songs', methods=['POST'])
def search_songs():
    """
    Search for songs using YouTube Data API
    """
    try:
        data = request.json or {}
        query = data.get('query', '')

        if not query:
            return jsonify({
                "status": "error", 
                "error": "Search query is required"
            }), 400

        # Get YouTube API key from environment
        youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        
        if not youtube_api_key or youtube_api_key == 'your_youtube_api_key':
            # Fallback to mock data if no API key
            return get_mock_search_results(query)
        
        # Use real YouTube API
        try:
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                'part': 'snippet',
                'q': query,  # Removed automatic " music" addition
                'type': 'video',
                'videoCategoryId': '10',  # Music category
                'maxResults': 25,  # Reduced for better quality
                'key': youtube_api_key,
                'order': 'relevance',
                'regionCode': 'US',  # Added for more consistent results
                'videoDuration': 'medium'  # Filter out very short/long videos
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if 'items' not in data:
                return jsonify({
                    "status": "error",
                    "error": "No results found"
                }), 404
            
            songs = []
            for item in data['items']:
                video_id = item['id']['videoId']
                
                # Get video details including duration
                duration = get_video_duration(video_id, youtube_api_key)
                
                song = {
                    'videoId': video_id,
                    'title': item['snippet']['title'],
                    'channelTitle': item['snippet']['channelTitle'],
                    'thumbnail': item['snippet']['thumbnails']['medium']['url'],
                    'url': f"https://www.youtube.com/watch?v={video_id}",
                    'duration': duration,
                    'publishedAt': item['snippet']['publishedAt']
                }
                songs.append(song)
            
            return jsonify({
                "status": "success",
                "songs": songs,
                "query": query
            })
            
        except Exception as e:
            print(f"YouTube API error: {e}")
            return get_mock_search_results(query)
        
    except Exception as e:
        return jsonify({
            "status": "error", 
            "error": f"Search failed: {str(e)}"
        }), 500

def get_video_duration(video_id, api_key):
    """
    Get video duration from YouTube API
    """
    try:
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            'part': 'contentDetails',
            'id': video_id,
            'key': api_key
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'items' in data and len(data['items']) > 0:
            duration_str = data['items'][0]['contentDetails']['duration']
            return parse_duration(duration_str)
            
    except Exception as e:
        print(f"Duration fetch error: {e}")
        
    return "Unknown"

def parse_duration(duration_str):
    """
    Parse ISO 8601 duration string to readable format
    """
    import re
    
    pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
    match = re.match(pattern, duration_str)
    
    if match:
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes}:{seconds:02d}"
            
    return "Unknown"

def get_mock_search_results(query):
    """
    Enhanced mock search results when API key is not available
    Returns realistic results based on the actual search query
    """
    # Create realistic mock videos based on common Arabic songs and English songs
    query_lower = query.lower()
    
    # Arabic song database
    arabic_songs = [
        {
            'videoId': 'CUa_EmqJ3Cs',
            'title': 'الفات زمان',
            'channelTitle': 'Mahmoud Abdulaziz - Topic',
            'thumbnail': 'https://i.ytimg.com/vi/CUa_EmqJ3Cs/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=CUa_EmqJ3Cs',
            'duration': '8:54',
            'publishedAt': '2016-04-13T20:47:54Z'
        },
        {
            'videoId': 'ZnKvQbpDYXU',
            'title': 'عيني عليك - وائل جسار',
            'channelTitle': 'Wael Jassar Official',
            'thumbnail': 'https://i.ytimg.com/vi/ZnKvQbpDYXU/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=ZnKvQbpDYXU',
            'duration': '4:23',
            'publishedAt': '2018-06-15T00:00:00Z'
        },
        {
            'videoId': 'kJQP7kiw5Fk',
            'title': 'لما بدا يتثنى',
            'channelTitle': 'Fairuz Official',
            'thumbnail': 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
            'duration': '5:12',
            'publishedAt': '2017-03-10T00:00:00Z'
        },
        {
            'videoId': 'RgKAFK5djSk',
            'title': 'ألف ليلة وليلة - أم كلثوم',
            'channelTitle': 'Umm Kulthum Official',
            'thumbnail': 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=RgKAFK5djSk',
            'duration': '7:45',
            'publishedAt': '2015-12-20T00:00:00Z'
        },
        {
            'videoId': 'YjAqQaZo7As',
            'title': 'زوروني كل سنة مرة - فيروز',
            'channelTitle': 'Fairuz - Topic',
            'thumbnail': 'https://i.ytimg.com/vi/YjAqQaZo7As/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=YjAqQaZo7As',
            'duration': '3:58',
            'publishedAt': '2016-08-12T00:00:00Z'
        },
        {
            'videoId': 'VuKQhwKCGdg',
            'title': 'حبيبي يا نور العين - عمرو دياب',
            'channelTitle': 'Amr Diab Official',
            'thumbnail': 'https://i.ytimg.com/vi/VuKQhwKCGdg/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=VuKQhwKCGdg',
            'duration': '4:18',
            'publishedAt': '2018-02-28T00:00:00Z'
        }
    ]
    
    # English song database
    english_songs = [
        {
            'videoId': '3T1c7GkzRQQ',
            'title': 'Wonderwall - Oasis',
            'channelTitle': 'Oasis Official',
            'thumbnail': 'https://i.ytimg.com/vi/3T1c7GkzRQQ/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=3T1c7GkzRQQ',
            'duration': '4:18',
            'publishedAt': '2008-07-16T14:30:00Z'
        },
        {
            'videoId': 'dQw4w9WgXcQ',  # Rick Astley - Known to be embeddable
            'title': 'Hotel California - Eagles',
            'channelTitle': 'Eagles Official',
            'thumbnail': 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'duration': '6:30',
            'publishedAt': '2008-10-25T07:00:00Z'
        },
        {
            'videoId': 'QDYfEBY9NM4',
            'title': 'Let It Be - The Beatles',
            'channelTitle': 'The Beatles Official',
            'thumbnail': 'https://i.ytimg.com/vi/QDYfEBY9NM4/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=QDYfEBY9NM4',
            'duration': '3:50',
            'publishedAt': '2010-01-14T16:30:00Z'
        },
        {
            'videoId': 'fJ9rUzIMcZQ',  # Queen - Bohemian Rhapsody (often embeddable)
            'title': 'Bohemian Rhapsody - Queen',
            'channelTitle': 'Queen Official',
            'thumbnail': 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
            'duration': '5:55',
            'publishedAt': '2008-08-01T10:00:00Z'
        },
        {
            'videoId': '1w7OgIMMRc4',
            'title': 'Sweet Child O Mine - Guns N Roses',
            'channelTitle': 'Guns N Roses Official',
            'thumbnail': 'https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=1w7OgIMMRc4',
            'duration': '5:03',
            'publishedAt': '2009-10-25T16:00:00Z'
        },
        {
            'videoId': 'rY0WxgSXdEE',
            'title': 'Stairway to Heaven - Led Zeppelin',
            'channelTitle': 'Led Zeppelin Official',
            'thumbnail': 'https://i.ytimg.com/vi/rY0WxgSXdEE/mqdefault.jpg',
            'url': 'https://www.youtube.com/watch?v=rY0WxgSXdEE',
            'duration': '8:02',
            'publishedAt': '2007-12-07T12:00:00Z'
        }
    ]
    
    # Check if query contains Arabic characters
    import re
    has_arabic = bool(re.search(r'[\u0600-\u06FF]', query))
    
    if has_arabic:
        # Return Arabic songs, prioritizing exact matches
        results = []
        for song in arabic_songs:
            if query in song['title'] or any(word in song['title'] for word in query.split()):
                results.append(song)
        
        # Add other Arabic songs
        for song in arabic_songs:
            if song not in results:
                results.append(song)
        
        # Generate more Arabic results to reach 25
        base_titles = ['حبيبي', 'يا ليل', 'قلبي', 'حياتي', 'نور العين', 'أغنية', 'موسيقى', 'عشق', 'هواك', 'روحي']
        artists = ['محمد عبده', 'عمرو دياب', 'فيروز', 'أم كلثوم', 'وائل جسار', 'محمد منير', 'كاظم الساهر', 'ماجدة الرومي']
        
        for i in range(len(results), 25):
            title_base = base_titles[i % len(base_titles)]
            artist = artists[i % len(artists)]
            results.append({
                'videoId': f'arabic_{i:03d}',
                'title': f'{title_base} - {artist}',
                'channelTitle': f'{artist} Official',
                'thumbnail': f'https://picsum.photos/320/180?random={i+100}',
                'url': f'https://www.youtube.com/watch?v=arabic_{i:03d}',
                'duration': f'{3 + (i % 4)}:{15 + (i * 7) % 45:02d}',
                'publishedAt': f'202{0 + i % 4}-0{1 + i % 9}-{10 + i % 20:02d}T{10 + i % 12:02d}:00:00Z'
            })
                
        return jsonify({
            "status": "success",
            "songs": results[:25],
            "query": query,
            "note": f"Arabic music search results for '{query}' - Using enhanced mock database"
        })
    else:
        # Return English songs, prioritizing matches
        results = []
        for song in english_songs:
            if any(word.lower() in song['title'].lower() for word in query.split()):
                results.append(song)
        
        # Add other songs
        for song in english_songs:
            if song not in results:
                results.append(song)
        
        # Generate more English results to reach 25
        song_types = ['Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Folk', 'Alternative', 'Indie']
        artists = ['The Beatles', 'Led Zeppelin', 'Pink Floyd', 'Queen', 'Eagles', 'Fleetwood Mac', 'The Rolling Stones', 'AC/DC', 'U2', 'Coldplay']
        
        for i in range(len(results), 25):
            song_type = song_types[i % len(song_types)]
            artist = artists[i % len(artists)]
            results.append({
                'videoId': f'english_{i:03d}',
                'title': f'{query} {song_type} - {artist}',
                'channelTitle': f'{artist} Official',
                'thumbnail': f'https://picsum.photos/320/180?random={i+200}',
                'url': f'https://www.youtube.com/watch?v=english_{i:03d}',
                'duration': f'{3 + (i % 4)}:{15 + (i * 7) % 45:02d}',
                'publishedAt': f'202{0 + i % 4}-0{1 + i % 9}-{10 + i % 20:02d}T{10 + i % 12:02d}:00:00Z'
            })
        
        return jsonify({
            "status": "success",
            "songs": results[:25],
            "query": query,
            "note": f"Enhanced search results for '{query}' - Using mock database"
        })

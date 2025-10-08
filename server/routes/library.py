from flask import Blueprint, request, jsonify, session
from models.user_library import UserLibrary, db
from models.user import User
from datetime import datetime
from sqlalchemy import desc

library_bp = Blueprint('library', __name__)

@library_bp.route('/api/library/add', methods=['POST'])
def add_to_library():
    """Add a song to user's library or update search history"""
    data = request.get_json()
    
    # For demo purposes, we'll use a mock user_id
    # In a real app, you'd get this from the session/auth token
    user_id = data.get('user_id', 1)  # Default to user 1 for demo
    
    title = data.get('title')
    artist = data.get('artist')
    youtube_url = data.get('youtube_url', '')
    genre = data.get('genre', '')
    is_favorite = data.get('is_favorite', False)
    is_saved = data.get('is_saved', True)
    
    if not title or not artist:
        return jsonify({'status': 'error', 'message': 'Title and artist are required'}), 400
    
    try:
        # Check if song already exists for this user
        existing_song = UserLibrary.query.filter_by(
            user_id=user_id,
            song_title=title,
            song_artist=artist
        ).first()
        
        if existing_song:
            # Update existing record
            existing_song.search_count += 1
            existing_song.last_searched = datetime.utcnow()
            existing_song.updated_at = datetime.utcnow()
            if is_saved:
                existing_song.is_saved = True
            if is_favorite:
                existing_song.is_favorite = True
        else:
            # Create new record
            library_song = UserLibrary(
                user_id=user_id,
                song_title=title,
                song_artist=artist,
                youtube_url=youtube_url,
                genre=genre,
                is_favorite=is_favorite,
                is_saved=is_saved,
                search_count=1,
                last_searched=datetime.utcnow()
            )
            db.session.add(library_song)
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Song added to library successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@library_bp.route('/api/library/recent', methods=['GET'])
def get_recent_searches():
    """Get user's recently searched songs"""
    user_id = request.args.get('user_id', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    try:
        recent_songs = UserLibrary.query.filter_by(user_id=user_id)\
            .order_by(desc(UserLibrary.last_searched))\
            .limit(limit).all()
        
        return jsonify({
            'status': 'success',
            'songs': [song.to_dict() for song in recent_songs]
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@library_bp.route('/api/library/saved', methods=['GET'])
def get_saved_songs():
    """Get user's saved songs"""
    user_id = request.args.get('user_id', 1, type=int)
    
    try:
        saved_songs = UserLibrary.query.filter_by(user_id=user_id, is_saved=True)\
            .order_by(desc(UserLibrary.updated_at)).all()
        
        return jsonify({
            'status': 'success',
            'songs': [song.to_dict() for song in saved_songs]
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@library_bp.route('/api/library/favorites', methods=['GET'])
def get_favorite_songs():
    """Get user's favorite songs"""
    user_id = request.args.get('user_id', 1, type=int)
    
    try:
        favorite_songs = UserLibrary.query.filter_by(user_id=user_id, is_favorite=True)\
            .order_by(desc(UserLibrary.updated_at)).all()
        
        return jsonify({
            'status': 'success',
            'songs': [song.to_dict() for song in favorite_songs]
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@library_bp.route('/api/library/toggle-favorite', methods=['POST'])
def toggle_favorite():
    """Toggle favorite status of a song"""
    data = request.get_json()
    user_id = data.get('user_id', 1)
    song_id = data.get('song_id')
    
    if not song_id:
        return jsonify({'status': 'error', 'message': 'Song ID is required'}), 400
    
    try:
        song = UserLibrary.query.filter_by(id=song_id, user_id=user_id).first()
        
        if not song:
            return jsonify({'status': 'error', 'message': 'Song not found'}), 404
        
        song.is_favorite = not song.is_favorite
        song.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'is_favorite': song.is_favorite,
            'message': 'Favorite status updated'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@library_bp.route('/api/library/remove', methods=['DELETE'])
def remove_from_library():
    """Remove a song from user's library"""
    data = request.get_json()
    user_id = data.get('user_id', 1)
    song_id = data.get('song_id')
    
    if not song_id:
        return jsonify({'status': 'error', 'message': 'Song ID is required'}), 400
    
    try:
        song = UserLibrary.query.filter_by(id=song_id, user_id=user_id).first()
        
        if not song:
            return jsonify({'status': 'error', 'message': 'Song not found'}), 404
        
        db.session.delete(song)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Song removed from library'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
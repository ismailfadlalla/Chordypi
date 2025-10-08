from flask import Blueprint, jsonify, request
from models.song import Song
from utils.auth_middleware import token_required

songs_bp = Blueprint('songs', __name__)

@songs_bp.route('/api/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify([song.to_dict() for song in songs]), 200

@songs_bp.route('/api/songs/<int:song_id>', methods=['GET'])
def get_song(song_id):
    song = Song.query.get_or_404(song_id)
    return jsonify(song.to_dict()), 200

@songs_bp.route('/api/songs', methods=['POST'])
@token_required
def create_song():
    data = request.json
    new_song = Song(title=data['title'], artist=data['artist'], chords=data['chords'])
    new_song.save()
    return jsonify(new_song.to_dict()), 201

@songs_bp.route('/api/songs/<int:song_id>', methods=['PUT'])
@token_required
def update_song(song_id):
    song = Song.query.get_or_404(song_id)
    data = request.json
    song.title = data.get('title', song.title)
    song.artist = data.get('artist', song.artist)
    song.chords = data.get('chords', song.chords)
    song.save()
    return jsonify(song.to_dict()), 200

@songs_bp.route('/api/songs/<int:song_id>', methods=['DELETE'])
@token_required
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    song.delete()
    return jsonify({'message': 'Song deleted successfully'}), 204
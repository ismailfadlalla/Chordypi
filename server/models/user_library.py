from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from .user import db

class UserLibrary(db.Model):
    __tablename__ = 'user_library'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    song_title = db.Column(db.String(255), nullable=False)
    song_artist = db.Column(db.String(255), nullable=False)
    youtube_url = db.Column(db.String(500), nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    
    # Library management
    is_favorite = db.Column(db.Boolean, default=False)
    is_saved = db.Column(db.Boolean, default=False)
    
    # Search history
    search_count = db.Column(db.Integer, default=1)
    last_searched = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref=db.backref('library_songs', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.song_title,
            'artist': self.song_artist,
            'youtube_url': self.youtube_url,
            'genre': self.genre,
            'is_favorite': self.is_favorite,
            'is_saved': self.is_saved,
            'search_count': self.search_count,
            'last_searched': self.last_searched.isoformat() if self.last_searched else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<UserLibrary(user_id={self.user_id}, title='{self.song_title}', artist='{self.song_artist}')>"
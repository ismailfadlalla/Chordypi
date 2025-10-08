from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm.attributes import flag_modified

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    hashed_password = db.Column(db.String(256), nullable=False)
    
    # Pi Network integration fields
    pi_user_id = db.Column(db.String(255), nullable=True)
    premium_features = db.Column(JSON, default=lambda: {
        'advancedAnalysis': False,
        'adFree': False,
        'premiumLibrary': False,
        'unlimitedSongs': False,
        'offlineMode': False,
        'annualSubscription': False
    })
    premium_unlocked_at = db.Column(JSON, default=lambda: {})
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def hash_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.hashed_password, password)
    
    def get_premium_features(self):
        """Get user's premium features"""
        return self.premium_features or {
            'advancedAnalysis': False,
            'adFree': False,
            'premiumLibrary': False,
            'unlimitedSongs': False,
            'offlineMode': False,
            'annualSubscription': False
        }
    
    def unlock_premium_feature(self, feature_key, payment_id=None):
        """Unlock a premium feature"""
        if not self.premium_features:
            self.premium_features = {}
        
        if not self.premium_unlocked_at:
            self.premium_unlocked_at = {}
        
        # Unlock the feature
        self.premium_features[feature_key] = True
        self.premium_unlocked_at[feature_key] = {
            'unlocked_at': datetime.utcnow().isoformat(),
            'payment_id': payment_id
        }
        
        # Mark model as dirty for SQLAlchemy
        flag_modified(self, 'premium_features')
        flag_modified(self, 'premium_unlocked_at')
        
        return {
            'feature': feature_key,
            'unlocked': True,
            'unlocked_at': self.premium_unlocked_at[feature_key]['unlocked_at'],
            'payment_id': payment_id
        }
    
    def is_premium_feature_unlocked(self, feature_key):
        """Check if a premium feature is unlocked"""
        features = self.get_premium_features()
        return features.get(feature_key, False)
    
    def get_unlocked_features(self):
        """Get list of unlocked premium features"""
        features = self.get_premium_features()
        return [key for key, value in features.items() if value]
    
    def get_premium_stats(self):
        """Get premium features statistics"""
        unlocked_features = self.get_unlocked_features()
        total_features = len(self.get_premium_features())
        
        return {
            'unlocked_count': len(unlocked_features),
            'total_features': total_features,
            'completion_percentage': int((len(unlocked_features) / total_features) * 100),
            'unlocked_features': unlocked_features
        }
    
    def connect_pi_network(self, pi_user_id):
        """Connect user to Pi Network"""
        self.pi_user_id = pi_user_id
    
    def is_pi_connected(self):
        """Check if user is connected to Pi Network"""
        return self.pi_user_id is not None
    
    def to_dict(self, include_premium=False):
        """Convert user to dictionary"""
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'pi_connected': self.is_pi_connected(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_premium:
            user_dict.update({
                'premium_features': self.get_premium_features(),
                'premium_stats': self.get_premium_stats()
            })
        
        return user_dict

    def __str__(self):
        return f'User: {self.username}'
from datetime import datetime
from .. import db
from sqlalchemy.dialects.postgresql import JSON

class PiPayment(db.Model):
    """Pi Network payment model"""
    __tablename__ = 'pi_payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    payment_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    txid = db.Column(db.String(255), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    memo = db.Column(db.String(500), nullable=True)
    metadata = db.Column(JSON, nullable=True)
    status = db.Column(db.String(50), default='pending', nullable=False)
    pi_user_id = db.Column(db.String(255), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    verified_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    user = db.relationship('User', backref='pi_payments')
    
    def __init__(self, user_id, payment_id, amount, memo=None, metadata=None, 
                 status='pending', txid=None, pi_user_id=None, verified_at=None):
        self.user_id = user_id
        self.payment_id = payment_id
        self.amount = amount
        self.memo = memo
        self.metadata = metadata or {}
        self.status = status
        self.txid = txid
        self.pi_user_id = pi_user_id
        self.verified_at = verified_at
    
    def to_dict(self):
        """Convert payment to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'payment_id': self.payment_id,
            'txid': self.txid,
            'amount': self.amount,
            'memo': self.memo,
            'metadata': self.metadata,
            'status': self.status,
            'pi_user_id': self.pi_user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
    
    def is_completed(self):
        """Check if payment is completed"""
        return self.status == 'completed'
    
    def is_verified(self):
        """Check if payment is verified"""
        return self.verified_at is not None
    
    @classmethod
    def get_by_payment_id(cls, payment_id):
        """Get payment by Pi payment ID"""
        return cls.query.filter_by(payment_id=payment_id).first()
    
    @classmethod
    def get_user_payments(cls, user_id, limit=10, page=1):
        """Get payments for a user with pagination"""
        return cls.query.filter_by(user_id=user_id)\
                       .order_by(cls.created_at.desc())\
                       .paginate(page=page, per_page=limit, error_out=False)
    
    @classmethod
    def get_completed_payments_for_user(cls, user_id):
        """Get all completed payments for a user"""
        return cls.query.filter_by(user_id=user_id, status='completed')\
                       .order_by(cls.completed_at.desc()).all()
    
    @classmethod
    def get_total_spent_by_user(cls, user_id):
        """Get total Pi spent by user"""
        result = db.session.query(db.func.sum(cls.amount))\
                          .filter_by(user_id=user_id, status='completed')\
                          .scalar()
        return float(result or 0)
    
    @classmethod
    def get_payments_by_feature(cls, user_id, feature):
        """Get payments for specific feature"""
        return cls.query.filter_by(user_id=user_id)\
                       .filter(cls.metadata['feature'].astext == feature)\
                       .order_by(cls.created_at.desc()).all()
    
    def __repr__(self):
        return f'<PiPayment {self.payment_id}: {self.amount}π for user {self.user_id}>'
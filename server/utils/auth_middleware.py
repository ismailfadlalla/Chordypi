from functools import wraps
from flask import request, jsonify
from models.user import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            user = User.verify_auth_token(token)
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 403
        
        return f(user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(user, *args, **kwargs):
        if not user.is_admin:
            return jsonify({'message': 'Admin access required!'}), 403
        return f(user, *args, **kwargs)
    
    return decorated
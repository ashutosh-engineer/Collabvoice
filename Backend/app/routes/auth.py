import jwt
import datetime
import os
from flask import Blueprint, request, jsonify, make_response
from ..models import db, User
from email_validator import validate_email, EmailNotValidError

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key')

def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
        
    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({'error': 'Invalid email format'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 400
        
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    token = generate_token(new_user.id)
    
    response = make_response(jsonify({
        'message': 'Registration successful',
        'user': new_user.to_dict(),
        'token': token
    }))
    
    response.set_cookie('auth_token', token, httponly=True, samesite='Lax')
    return response, 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({
            'error': 'User not found',
            'suggest_signup': True
        }), 404
        
    if not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    token = generate_token(user.id)
    
    response = make_response(jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'token': token
    }))
    
    response.set_cookie('auth_token', token, httponly=True, samesite='Lax')
    return response, 200

@auth_bp.route('/oauth/<provider>', methods=['POST'])
def oauth_login(provider):
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'OAuth failed'}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user:
        username = email.split('@')[0]
        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit()
        
    token = generate_token(user.id)
    return jsonify({
        'message': f'Logged in via {provider}',
        'user': user.to_dict(),
        'token': token
    }), 200

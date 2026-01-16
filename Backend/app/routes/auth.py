import jwt
import datetime
import os
import requests
from flask import Blueprint, request, jsonify, make_response
from ..models import db, User
from email_validator import validate_email, EmailNotValidError

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key')

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'https://collabvoice.vercel.app/auth/google/callback')

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
GITHUB_REDIRECT_URI = os.getenv('GITHUB_REDIRECT_URI', 'https://collabvoice.vercel.app/auth/github/callback')

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

@auth_bp.route('/oauth/google', methods=['POST'])
def google_oauth():
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
        
    # Exchange code for tokens
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    
    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()
    
    if 'error' in token_json:
        return jsonify({'error': 'Failed to exchange code for token', 'details': token_json}), 400
        
    access_token = token_json.get('access_token')
    
    # Get user info
    user_info_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
    user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
    user_info = user_info_response.json()
    
    email = user_info.get('email')
    google_id = user_info.get('sub')
    name = user_info.get('name')
    picture = user_info.get('picture')
    
    if not email:
        return jsonify({'error': 'Failed to get user info from Google'}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create user if it doesn't exist
        username = email.split('@')[0]
        # Check if username exists, if so append some random chars or use name
        if User.query.filter_by(username=username).first():
            username = f"{username}_{google_id[:5]}"
            
        user = User(
            username=username,
            email=email,
            google_id=google_id,
            avatar_url=picture
        )
        db.session.add(user)
    else:
        # Update google_id and avatar if not set
        if not user.google_id:
            user.google_id = google_id
        user.avatar_url = picture
        
    db.session.commit()
    
    token = generate_token(user.id)
    
    response = make_response(jsonify({
        'message': 'Logged in via Google',
        'user': user.to_dict(),
        'token': token
    }))
    
    response.set_cookie('auth_token', token, httponly=True, samesite='Lax')
    return response, 200

@auth_bp.route('/oauth/github', methods=['POST'])
def github_oauth():
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
        
    # Exchange code for tokens
    token_url = 'https://github.com/login/oauth/access_token'
    token_headers = {'Accept': 'application/json'}
    token_data = {
        'code': code,
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'redirect_uri': GITHUB_REDIRECT_URI
    }
    
    token_response = requests.post(token_url, headers=token_headers, data=token_data)
    token_json = token_response.json()
    
    if 'error' in token_json:
        return jsonify({'error': 'Failed to exchange code for token', 'details': token_json}), 400
        
    access_token = token_json.get('access_token')
    
    # Get user info
    user_url = 'https://api.github.com/user'
    user_headers = {
        'Authorization': f'token {access_token}',
        'Accept': 'application/json'
    }
    user_response = requests.get(user_url, headers=user_headers)
    user_info = user_response.json()
    
    github_id = str(user_info.get('id'))
    email = user_info.get('email')
    
    # GitHub email might be private, need to fetch emails if null
    if not email:
        emails_url = 'https://api.github.com/user/emails'
        emails_response = requests.get(emails_url, headers=user_headers)
        emails_info = emails_response.json()
        primary_email = next((e['email'] for e in emails_info if e['primary']), None)
        email = primary_email or (emails_info[0]['email'] if emails_info else None)

    if not email:
        return jsonify({'error': 'Failed to get email from GitHub'}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user:
        username = user_info.get('login') or email.split('@')[0]
        if User.query.filter_by(username=username).first():
            username = f"{username}_{github_id[:5]}"
            
        user = User(
            username=username,
            email=email,
            github_id=github_id,
            avatar_url=user_info.get('avatar_url')
        )
        db.session.add(user)
    else:
        if not user.github_id:
            user.github_id = github_id
        user.avatar_url = user_info.get('avatar_url')
        
    db.session.commit()
    
    token = generate_token(user.id)
    
    response = make_response(jsonify({
        'message': 'Logged in via GitHub',
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

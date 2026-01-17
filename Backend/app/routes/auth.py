import jwt
import datetime
import os
import requests
import uuid
import logging
from functools import wraps
from flask import Blueprint, request, jsonify, make_response
from ..models import db, User
from email_validator import validate_email, EmailNotValidError

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key')

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'https://collabvoice.vercel.app/auth/google/callback')

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
GITHUB_REDIRECT_URI = os.getenv('GITHUB_REDIRECT_URI', 'https://collabvoice.vercel.app/auth/github/callback')

def generate_token(user_id, session_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'sid': session_id
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['sub'])
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
            # Session check: Verify if the session ID in the token matches the current one in DB
            if current_user.current_session_id != data.get('sid'):
                return jsonify({'error': 'Session expired. Another login detected.'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except Exception:
            return jsonify({'error': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"Registration attempt for: {data.get('email')}")
        
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
        
        # Generate new session ID
        session_id = str(uuid.uuid4())
        new_user.current_session_id = session_id
        
        db.session.add(new_user)
        db.session.commit()
        
        token = generate_token(new_user.id, session_id)
        
        response = make_response(jsonify({
            'message': 'Registration successful',
            'user': new_user.to_dict(),
            'token': token
        }))
        
        response.set_cookie(
            'auth_token', 
            token, 
            httponly=True, 
            samesite='None', 
            secure=True
        )
        return response, 201
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        logger.info(f"Login attempt for: {email}")
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
            
        # Generate new session ID and invalidate previous ones
        session_id = str(uuid.uuid4())
        user.current_session_id = session_id
        db.session.commit()
        
        token = generate_token(user.id, session_id)
        
        response = make_response(jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        }))
        
        response.set_cookie('auth_token', token, httponly=True, samesite='None', secure=True)
        return response, 200
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/oauth/google', methods=['POST'])
def google_oauth():
    try:
        data = request.get_json()
        code = data.get('code')
        
        logger.info(f"Google OAuth attempt with code: {code[:20]}...")
        
        if not code:
            return jsonify({'error': 'No code provided'}), 400
        
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            logger.error("Google OAuth credentials not configured")
            return jsonify({'error': 'OAuth not configured on server'}), 500
            
        # Exchange code for tokens
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': GOOGLE_REDIRECT_URI,
            'grant_type': 'authorization_code'
        }
        
        logger.info(f"Exchanging code with redirect_uri: {GOOGLE_REDIRECT_URI}")
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        
        if 'error' in token_json:
            logger.error(f"Google token exchange error: {token_json}")
            return jsonify({'error': 'Failed to exchange code for token', 'details': token_json}), 400
            
        access_token = token_json.get('access_token')
        
        # Get user info
        user_info_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
        user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        user_info = user_info_response.json()
        
        logger.info(f"Google user info received for: {user_info.get('email')}")
        
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
            # Check if username exists, if so append some random chars
            if User.query.filter_by(username=username).first():
                username = f"{username}_{google_id[:5]}"
                
            user = User(
                username=username,
                email=email,
                google_id=google_id,
                avatar_url=picture
            )
            db.session.add(user)
            logger.info(f"Created new user via Google OAuth: {email}")
        else:
            # Update google_id and avatar if not set
            if not user.google_id:
                user.google_id = google_id
            user.avatar_url = picture
            logger.info(f"Updated existing user via Google OAuth: {email}")
            
        # Generate new session ID
        session_id = str(uuid.uuid4())
        user.current_session_id = session_id
        db.session.commit()
        
        token = generate_token(user.id, session_id)
        
        response = make_response(jsonify({
            'message': 'Logged in via Google',
            'user': user.to_dict(),
            'token': token
        }))
        
        response.set_cookie('auth_token', token, httponly=True, samesite='None', secure=True)
        return response, 200
    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Google OAuth failed', 'details': str(e)}), 500

@auth_bp.route('/oauth/github', methods=['POST'])
def github_oauth():
    try:
        data = request.get_json()
        code = data.get('code')
        
        logger.info(f"GitHub OAuth attempt with code: {code[:20]}...")
        
        if not code:
            return jsonify({'error': 'No code provided'}), 400
        
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
            logger.error("GitHub OAuth credentials not configured")
            return jsonify({'error': 'OAuth not configured on server'}), 500
            
        # Exchange code for tokens
        token_url = 'https://github.com/login/oauth/access_token'
        token_headers = {'Accept': 'application/json'}
        token_data = {
            'code': code,
            'client_id': GITHUB_CLIENT_ID,
            'client_secret': GITHUB_CLIENT_SECRET,
            'redirect_uri': GITHUB_REDIRECT_URI,
            'scope': 'user:email repo'  # Request repository access
        }
        
        logger.info(f"Exchanging code with redirect_uri: {GITHUB_REDIRECT_URI}")
        token_response = requests.post(token_url, headers=token_headers, data=token_data)
        token_json = token_response.json()
        
        if 'error' in token_json:
            logger.error(f"GitHub token exchange error: {token_json}")
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
        
        logger.info(f"GitHub user info received for: {email}")
            
        user = User.query.filter_by(email=email).first()
        
        if not user:
            username = user_info.get('login') or email.split('@')[0]
            if User.query.filter_by(username=username).first():
                username = f"{username}_{github_id[:5]}"
                
            user = User(
                username=username,
                email=email,
                github_id=github_id,
                avatar_url=user_info.get('avatar_url'),
                github_access_token=access_token  # Store the access token
            )
            db.session.add(user)
            logger.info(f"Created new user via GitHub OAuth: {email}")
        else:
            if not user.github_id:
                user.github_id = github_id
            user.avatar_url = user_info.get('avatar_url')
            user.github_access_token = access_token  # Update the access token
            logger.info(f"Updated existing user via GitHub OAuth: {email}")
            
        # Generate new session ID
        session_id = str(uuid.uuid4())
        user.current_session_id = session_id
        db.session.commit()
        
        token = generate_token(user.id, session_id)
        
        response = make_response(jsonify({
            'message': 'Logged in via GitHub',
            'user': user.to_dict(),
            'token': token
        }))
        
        response.set_cookie('auth_token', token, httponly=True, samesite='None', secure=True)
        return response, 200
    except Exception as e:
        logger.error(f"GitHub OAuth error: {str(e)}", exc_info=True)
        return jsonify({'error': 'GitHub OAuth failed', 'details': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    return jsonify({
        'message': 'Token is valid',
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    """Logout user and invalidate session"""
    try:
        # Invalidate current session
        current_user.current_session_id = None
        db.session.commit()
        
        response = make_response(jsonify({
            'message': 'Logged out successfully'
        }))
        
        # Clear cookie
        response.set_cookie('auth_token', '', expires=0, httponly=True, samesite='None', secure=True)
        return response, 200
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({'error': 'Logout failed'}), 500

@auth_bp.route('/sessions/invalidate-others', methods=['POST'])
@token_required
def invalidate_other_sessions(current_user):
    """Invalidate all other sessions for this user"""
    try:
        # Generate new session ID, invalidating all others
        session_id = str(uuid.uuid4())
        current_user.current_session_id = session_id
        db.session.commit()
        
        # Generate new token
        new_token = generate_token(current_user.id, session_id)
        
        response = make_response(jsonify({
            'message': 'Other sessions invalidated',
            'token': new_token
        }))
        
        response.set_cookie('auth_token', new_token, httponly=True, samesite='None', secure=True)
        return response, 200
    except Exception as e:
        logger.error(f"Session invalidation error: {str(e)}")
        return jsonify({'error': 'Failed to invalidate sessions'}), 500

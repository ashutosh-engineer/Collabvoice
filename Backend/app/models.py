from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)  # Nullable for OAuth users
    github_id = db.Column(db.String(50), unique=True, nullable=True)
    google_id = db.Column(db.String(50), unique=True, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    github_access_token = db.Column(db.String(255), nullable=True)  # Store GitHub token for repo access
    current_session_id = db.Column(db.String(255), nullable=True)  # For single session enforcement
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password):
        if not self.password_hash:
            return False
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar_url': self.avatar_url,
            'has_github_access': bool(self.github_access_token),
            'created_at': self.created_at.isoformat()
        }

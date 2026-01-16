import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from .models import db, bcrypt

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    load_dotenv()
    
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Session/Cookie configuration for cross-origin (Vercel -> Render)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['REMEMBER_COOKIE_SAMESITE'] = 'None'
    app.config['REMEMBER_COOKIE_SECURE'] = True

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    
    # CORS Configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "https://collabvoice.vercel.app",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Content-Type", 
                "Authorization", 
                "Access-Control-Allow-Credentials", 
                "X-CSRFToken", 
                "x-csrftoken", 
                "X-Csrftoken",
                "X-CSRF-TOKEN"
            ],
            "expose_headers": ["Content-Type", "Authorization", "X-CSRFToken", "x-csrftoken"],
            "supports_credentials": True
        }
    })
    
    migrate = Migrate(app, db)

    # Register Blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route("/", methods=['GET'])
    def index():
        logger.info("Index route accessed")
        return "CollabVoice Backend is LIVE 🚀"

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'CollabVoice Backend is running with Auth enabled!'
        })

    logger.info("Application created successfully")
    return app

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from .models import db, bcrypt

def create_app():
    load_dotenv()
    
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    
    # CORS Configuration
    allowed_origins = [
        "https://collabvoice.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
    
    migrate = Migrate(app, db)

    # Register Blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route("/", methods=['GET'])
    def index():
        return "CollabVoice Backend is LIVE 🚀"

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'CollabVoice Backend is running with Auth enabled!'
        })

    return app

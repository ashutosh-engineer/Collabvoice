import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, bcrypt
from auth import auth_bp
from flask_migrate import Migrate

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///collabvoice.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
CORS(app, supports_credentials=True)
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'CollabVoice Backend is running with Auth enabled!'
    })

# Create tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

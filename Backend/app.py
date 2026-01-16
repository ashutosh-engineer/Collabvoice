import os
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    # Standard local development block
    with app.app_context():
        db.create_all()
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True') == 'True'
    
    print(f"Starting local development server on port {port} (debug={debug})...")
    app.run(host='0.0.0.0', port=port, debug=debug)

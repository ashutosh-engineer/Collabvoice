import os
from app import create_app, db

# This entry point is used for local development or direct execution
# In production (Render/Gunicorn), wsgi.py is the preferred entry point
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("✅ Local: Database tables initialized")
        except Exception as e:
            print(f"⚠️  Local: Database error: {e}")
    
    port = int(os.environ.get('PORT', 5000))
    # In production, debug should always be False
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting development server on port {port} (debug={debug})...")
    print("💡 Note: Use 'gunicorn wsgi:app' for production deployment.")
    app.run(host='0.0.0.0', port=port, debug=debug)

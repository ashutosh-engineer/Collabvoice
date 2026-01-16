import os
from app import create_app, db

# Create the application instance at module level
app = create_app()

# Initialize database tables on startup
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables initialized successfully")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")

if __name__ == "__main__":
    # Local fallback
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

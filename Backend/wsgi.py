import os
from app import create_app, db

# Create the application instance at module level
app = create_app()

# Initialize database tables and handle schema updates
with app.app_context():
    try:
        db.create_all()
        # Check if current_session_id column exists
        from sqlalchemy import inspect, text
        inspector = inspect(db.engine)
        columns = [c['name'] for c in inspector.get_columns('users')]
        
        if 'current_session_id' not in columns:
            print("🔧 Updating database schema: adding current_session_id to users table...")
            with db.engine.connect() as conn:
                conn.execute(text('ALTER TABLE users ADD COLUMN current_session_id VARCHAR(255)'))
                conn.commit()
            print("✅ Database schema updated successfully")
        
        print("✅ Database tables initialized successfully")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")

if __name__ == "__main__":
    # Local fallback
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

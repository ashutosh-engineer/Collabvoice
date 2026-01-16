import os
from app import create_app, db

# This entry point is used for local development or direct execution
# In production (Render/Gunicorn), wsgi.py is the preferred entry point
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            from sqlalchemy import text
            
            # Check if current_session_id column exists
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='current_session_id'
            """)
            
            result = db.session.execute(check_query).fetchone()
            
            if not result:
                print("🔧 Adding current_session_id column...")
                alter_query = text("ALTER TABLE users ADD COLUMN current_session_id VARCHAR(255)")
                db.session.execute(alter_query)
                db.session.commit()
                print("✅ current_session_id column added")
            
            # Create any other missing tables
            db.create_all()
            print("✅ Database tables initialized")
        except Exception as e:
            print(f"⚠️  Database error: {e}")
            import traceback
            traceback.print_exc()
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting server on port {port} (debug={debug})...")
    app.run(host='0.0.0.0', port=port, debug=debug)

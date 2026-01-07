from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend is running."""
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running successfully!'
    })


@app.route('/api/hello', methods=['GET'])
def hello():
    """Simple hello endpoint."""
    return jsonify({
        'message': 'Hello from CollabVoice API!'
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)

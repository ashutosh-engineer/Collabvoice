import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Backend not connected');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎙️ CollabVoice</h1>
        <p className="subtitle">Collaborative Voice Application</p>
      </header>
      <main className="App-main">
        <div className="status-card">
          <h2>Backend Status</h2>
          {loading ? (
            <p className="loading">Connecting...</p>
          ) : (
            <p className={message === 'Backend not connected' ? 'error' : 'success'}>
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

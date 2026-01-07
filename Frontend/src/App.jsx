import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Placeholder for Dashboard */}
        <Route path="/dashboard" element={<div style={{ padding: '50px', textAlign: 'center', color: 'white' }}><h1>Dashboard Coming Soon</h1><a href="/" style={{ color: 'var(--primary-400)' }}>Back Home</a></div>} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RedirectIfAuthenticated from './components/Auth/RedirectIfAuthenticated';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import LoadingScreen from './components/Auth/LoadingScreen';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <RedirectIfAuthenticated>
                <Signup />
              </RedirectIfAuthenticated>
            } 
          />
          <Route path="/auth/callback" element={<LoadingScreen />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

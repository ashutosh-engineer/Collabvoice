import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import OAuthButtons from './OAuthButtons';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login({ email, password });
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            if (result.error.includes('User not found')) {
                setError('User not found. Redirecting to sign up...');
                setTimeout(() => navigate('/signup'), 2000);
            } else {
                setError(result.error);
            }
        }
        
        setIsLoading(false);
    };

    const handleGoogleLogin = () => {
        const params = new URLSearchParams({
            client_id: '766375292264-jskoepianq8uqk8spm3uvcss14hv3ns3.apps.googleusercontent.com',
            redirect_uri: 'https://collabvoice.vercel.app/auth/google/callback',
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'select_account'
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    };

    const handleGithubLogin = () => {
        const params = new URLSearchParams({
            client_id: 'Ov23litdH44THSl3N9ED',
            redirect_uri: 'https://collabvoice.vercel.app/auth/github/callback',
            scope: 'user:email'
        });
        window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <img src="/logo.jpeg" alt="CollabVoice" />
                        <span>CollabVoice</span>
                    </Link>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Continue your collaborative journey</p>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <div className="input-container">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id="email"
                                className="auth-input"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email" className="floating-label">Email Address</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-container">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="password"
                                className="auth-input"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password" className="floating-label">Password</label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isLoading}>
                        <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-divider">Or continue with</div>

                <div className="social-btns">
                    <button className="social-btn" type="button" onClick={handleGithubLogin}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span>GitHub</span>
                    </button>
                    <button className="social-btn" type="button" onClick={handleGoogleLogin}>
                        <svg viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                            <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083A19.92 19.92 0 0 1 44 24c0 11.045-8.955 20-20 20c-7.773 0-14.495-4.444-17.773-10.921l6.522-5.025C14.381 32.683 18.798 36 24 36c5.223 0 9.654-3.343 11.303-8H24v-8h19.611z" />
                        </svg>
                        <span>Google</span>
                    </button>
                </div>

                <div className="auth-footer">
                    <span>
                        Don't have an account?
                        <Link to="/signup" className="auth-link">Sign Up</Link>
                    </span>
                    <Link to="/" className="auth-back-home">
                        <ArrowLeft size={14} />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

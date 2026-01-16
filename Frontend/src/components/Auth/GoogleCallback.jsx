import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../../api';

const GoogleCallback = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');

            if (!code) {
                setError('No authorization code received from Google');
                return;
            }

            try {
                const response = await api.post('/auth/oauth/google', { code });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                navigate('/dashboard');
            } catch (err) {
                console.error('Google OAuth error:', err);
                setError(err.response?.data?.error || 'Failed to authenticate with Google');
            }
        };

        handleCallback();
    }, [location, navigate]);

    if (error) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div className="error-message">
                        <AlertCircle size={24} />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn--primary"
                        style={{ marginTop: '20px' }}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-400)" />
                <h2 style={{ marginTop: '24px', color: 'white' }}>Verifying Google Account...</h2>
                <p style={{ color: 'var(--slate-400)', marginTop: '8px' }}>This will only take a moment</p>
            </div>
        </div>
    );
};

export default GoogleCallback;

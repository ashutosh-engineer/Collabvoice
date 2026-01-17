import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoadingScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const provider = searchParams.get('provider') || 'OAuth';

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    if (error) {
      setStatus('Authentication failed');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Simulate authentication steps based on provider
      if (provider === 'github') {
        setTimeout(() => setStatus('Verifying GitHub credentials...'), 800);
        setTimeout(() => setStatus('Accessing your repositories...'), 1600);
        setTimeout(() => setStatus('Setting up collaboration workspace...'), 2400);
        setTimeout(() => setStatus('Configuring repository permissions...'), 3200);
      } else if (provider === 'google') {
        setTimeout(() => setStatus('Verifying Google credentials...'), 800);
        setTimeout(() => setStatus('Setting up your profile...'), 1600);
        setTimeout(() => setStatus('Preparing your workspace...'), 2400);
        setTimeout(() => setStatus('Loading collaboration tools...'), 3200);
      } else {
        setTimeout(() => setStatus('Verifying credentials...'), 800);
        setTimeout(() => setStatus('Setting up your workspace...'), 1600);
        setTimeout(() => setStatus('Loading repositories...'), 2400);
        setTimeout(() => setStatus('Almost ready...'), 3200);
      }
      
      setTimeout(() => {
        setProgress(100);
        setStatus('Welcome to CollabVoice!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }, 4000);
    } else {
      setStatus('No authentication token received');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    return () => clearInterval(progressInterval);
  }, [searchParams, navigate]);

  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* Animated Logo */}
        <div className="logo-container">
          <div className="logo-pulse">
            <img src="/logo.jpeg" alt="CollabVoice" className="loading-logo" />
          </div>
          <div className="logo-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>

        {/* Status Text */}
        <h2 className="loading-title">{status}</h2>
        
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>

        {/* Loading Dots */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .loading-content {
          text-align: center;
          color: white;
          z-index: 10;
          position: relative;
        }

        .logo-container {
          position: relative;
          margin-bottom: 40px;
        }

        .logo-pulse {
          position: relative;
          z-index: 3;
        }

        .loading-logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          animation: logoFloat 3s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .logo-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .ring {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .ring-1 {
          width: 120px;
          height: 120px;
          animation: ringPulse 2s ease-in-out infinite;
        }

        .ring-2 {
          width: 160px;
          height: 160px;
          animation: ringPulse 2s ease-in-out infinite 0.5s;
        }

        .ring-3 {
          width: 200px;
          height: 200px;
          animation: ringPulse 2s ease-in-out infinite 1s;
        }

        .loading-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
          animation: textGlow 2s ease-in-out infinite alternate;
        }

        .progress-container {
          width: 300px;
          margin: 0 auto 20px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00f5ff, #0080ff, #00f5ff);
          background-size: 200% 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
          animation: progressShimmer 2s linear infinite;
        }

        .progress-text {
          font-size: 14px;
          opacity: 0.8;
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 6s linear infinite;
        }

        .particle-1 { left: 10%; animation-delay: 0s; }
        .particle-2 { left: 20%; animation-delay: 0.5s; }
        .particle-3 { left: 30%; animation-delay: 1s; }
        .particle-4 { left: 40%; animation-delay: 1.5s; }
        .particle-5 { left: 50%; animation-delay: 2s; }
        .particle-6 { left: 60%; animation-delay: 2.5s; }
        .particle-7 { left: 70%; animation-delay: 3s; }
        .particle-8 { left: 80%; animation-delay: 3.5s; }
        .particle-9 { left: 90%; animation-delay: 4s; }
        .particle-10 { left: 15%; animation-delay: 4.5s; }
        .particle-11 { left: 25%; animation-delay: 5s; }
        .particle-12 { left: 35%; animation-delay: 0.2s; }
        .particle-13 { left: 45%; animation-delay: 0.7s; }
        .particle-14 { left: 55%; animation-delay: 1.2s; }
        .particle-15 { left: 65%; animation-delay: 1.7s; }
        .particle-16 { left: 75%; animation-delay: 2.2s; }
        .particle-17 { left: 85%; animation-delay: 2.7s; }
        .particle-18 { left: 95%; animation-delay: 3.2s; }
        .particle-19 { left: 5%; animation-delay: 3.7s; }
        .particle-20 { left: 95%; animation-delay: 4.2s; }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes ringPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.1;
          }
        }

        @keyframes textGlow {
          0% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
          100% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
        }

        @keyframes progressShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .loading-logo {
            width: 60px;
            height: 60px;
          }

          .ring-1 { width: 100px; height: 100px; }
          .ring-2 { width: 130px; height: 130px; }
          .ring-3 { width: 160px; height: 160px; }

          .loading-title {
            font-size: 20px;
            margin-bottom: 25px;
          }

          .progress-container {
            width: 250px;
          }
        }

        @media (max-width: 480px) {
          .loading-logo {
            width: 50px;
            height: 50px;
          }

          .ring-1 { width: 80px; height: 80px; }
          .ring-2 { width: 110px; height: 110px; }
          .ring-3 { width: 140px; height: 140px; }

          .loading-title {
            font-size: 18px;
            margin-bottom: 20px;
          }

          .progress-container {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
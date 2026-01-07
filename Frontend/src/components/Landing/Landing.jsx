import React from 'react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.jpeg" alt="CollabVoice" className="logo-img" />
            <span className="logo-text">CollabVoice</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#tech-stack">Tech Stack</a>
            <a href="#team">Team</a>
          </div>
          <div className="nav-actions">
            <button className="btn btn-outline">Sign In</button>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Next-Generation Collaborative Development</div>
          <h1 className="hero-title">
            Code Together.<br />
            <span className="gradient-text">Build Together.</span><br />
            Ship Together.
          </h1>
          <p className="hero-description">
            The ultimate collaborative code editor with real-time editing, AI-powered assistance, 
            video calling, and built-in version control. Everything your team needs in one place.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg">
              <span>Start Coding Free</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="btn btn-outline btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Watch Demo</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Developers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Sessions</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="code-editor-preview">
            <div className="editor-header">
              <div className="editor-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="editor-title">main.py - CollabVoice</span>
              <div className="editor-users">
                <div className="user-avatar" style={{backgroundColor: '#667eea'}}>A</div>
                <div className="user-avatar" style={{backgroundColor: '#f56565'}}>B</div>
                <div className="user-avatar" style={{backgroundColor: '#48bb78'}}>C</div>
              </div>
            </div>
            <div className="editor-content">
              <pre>
                <code>
{`def collaborate():
    """Real-time collaborative coding"""
    team = CollabVoice.create_session()
    
    # AI-powered suggestions
    ai_agent = AI.initialize()
    
    while team.is_active():
        code = team.sync_changes()
        suggestions = ai_agent.analyze(code)
        
        if suggestions.has_anomalies():
            team.notify(suggestions)
    
    return team.deploy()`}
                </code>
              </pre>
              <div className="cursor-indicator">
                <span className="cursor-name">Alice is typing...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need to Build Amazing Software</h2>
          <p className="section-description">
            Powerful features designed to enhance your development workflow and team collaboration.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: '#667eea20', color: '#667eea'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="feature-title">Real-Time Collaboration</h3>
            <p className="feature-description">
              Code together with your team in real-time. See cursors, selections, and changes instantly with zero lag.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: '#f5656520', color: '#f56565'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <h3 className="feature-title">AI-Powered Agents</h3>
            <p className="feature-description">
              Intelligent AI assistants analyze your code, detect anomalies, suggest improvements, and help you write better code.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: '#48bb7820', color: '#48bb78'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3 className="feature-title">Video Calling</h3>
            <p className="feature-description">
              Built-in HD video conferencing for seamless pair programming and code reviews without switching apps.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: '#ed8a1920', color: '#ed8a19'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="3" x2="6" y2="15"></line>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
            </div>
            <h3 className="feature-title">Version Control</h3>
            <p className="feature-description">
              Integrated Git support and custom versioning system. Branch, merge, and track changes without leaving the editor.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: '#9f7aea20', color: '#9f7aea'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="feature-title">Cloud Storage</h3>
            <p className="feature-description">
              Secure, encrypted cloud storage for all your projects. Access your code from anywhere, anytime.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{backgroundColor: '#38b2ac20', color: '#38b2ac'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="feature-title">Anomaly Detection</h3>
            <p className="feature-description">
              ML algorithms continuously scan your code for bugs, security vulnerabilities, and performance issues.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <span className="section-badge">How It Works</span>
          <h2 className="section-title">Start Collaborating in Minutes</h2>
          <p className="section-description">
            Getting started with CollabVoice is simple. Follow these steps to begin.
          </p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create a Session</h3>
              <p>Sign up and create a new collaborative coding session in seconds.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Invite Your Team</h3>
              <p>Share the session link with your teammates. They can join instantly.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Code Together</h3>
              <p>Write, review, and debug code together in real-time with AI assistance.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Ship Faster</h3>
              <p>Deploy with confidence using built-in version control and testing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="tech-stack">
        <div className="section-header">
          <span className="section-badge">Technology</span>
          <h2 className="section-title">Built with Modern Technologies</h2>
          <p className="section-description">
            Powered by cutting-edge technologies for performance, scalability, and reliability.
          </p>
        </div>
        <div className="tech-grid">
          <div className="tech-item">
            <div className="tech-icon">⚛️</div>
            <span>React</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">⚡</div>
            <span>Vite</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🐍</div>
            <span>Python</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🌶️</div>
            <span>Flask</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🧠</div>
            <span>TensorFlow</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">📹</div>
            <span>WebRTC</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🔌</div>
            <span>Socket.IO</span>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🐘</div>
            <span>PostgreSQL</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Development Workflow?</h2>
          <p>Join thousands of developers who are already collaborating smarter with CollabVoice.</p>
          <div className="cta-buttons">
            <button className="btn btn-white btn-lg">Get Started Free</button>
            <button className="btn btn-outline-white btn-lg">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/logo.jpeg" alt="CollabVoice" className="logo-img" />
                <span>CollabVoice</span>
              </div>
              <p>The next-generation collaborative code editor with AI integration.</p>
              <div className="social-links">
                <a href="https://github.com/ashutosh-engineer/collabvoice" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/collabvoice" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://discord.gg/collabvoice" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#changelog">Changelog</a>
                <a href="#roadmap">Roadmap</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#docs">Documentation</a>
                <a href="#api">API Reference</a>
                <a href="#guides">Guides</a>
                <a href="#blog">Blog</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
                <a href="#press">Press</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
                <a href="#security">Security</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CollabVoice. All rights reserved.</p>
            <p>Built with ❤️ by developers, for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

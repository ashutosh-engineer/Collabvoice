import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

// ============================================
// CollabVoice SaaS Landing Page Component
// ============================================

const Landing = () => {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState('');
  const heroRef = useRef(null);

  // Typing animation for hero
  const codeSnippets = [
    'function collaborate() {',
    '  const team = await connect();',
    '  team.code.sync(realtime);',
    '  ai.analyze(code);',
    '  return success;',
    '}'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    const fullText = codeSnippets.join('\n');
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        index = 0;
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
  ];

  const features = [
    {
      icon: '🔄',
      title: 'Real-Time Collaboration',
      description: 'Code together with your team in real-time. See live cursor positions, instant code sync, and seamless conflict resolution.',
      highlights: ['Live Cursor Tracking', 'Instant Sync', 'Smart Merge']
    },
    {
      icon: '🤖',
      title: 'AI-Powered Intelligence',
      description: 'Leverage cutting-edge AI agents that understand your codebase, detect anomalies, and provide intelligent suggestions.',
      highlights: ['Code Analysis', 'Bug Detection', 'Smart Autocomplete']
    },
    {
      icon: '📹',
      title: 'Integrated Video Communication',
      description: 'Built-in HD video calling and screen sharing. Code review sessions and pair programming made effortless.',
      highlights: ['HD Video Calls', 'Screen Sharing', 'Session Recording']
    },
    {
      icon: '🗂️',
      title: 'Version Control & Storage',
      description: 'Full Git integration plus our custom VCS for quick iterations. Cloud storage keeps your projects safe and accessible.',
      highlights: ['Git Integration', 'Cloud Storage', 'Branch Management']
    },
    {
      icon: '🔍',
      title: 'ML-Powered Analysis',
      description: 'Machine learning algorithms continuously scan for bugs, security vulnerabilities, and performance bottlenecks.',
      highlights: ['Security Scanning', 'Performance Prediction', 'Pattern Recognition']
    },
    {
      icon: '🎨',
      title: 'Premium Developer Experience',
      description: 'Support for 100+ languages, customizable themes, extensions, and flexible workspace layouts.',
      highlights: ['100+ Languages', 'Custom Themes', 'Extensions']
    }
  ];

  const useCases = [
    {
      title: 'Remote Teams',
      description: 'Bridge the distance. Code together as if you\'re in the same room with real-time sync and video communication.',
      icon: '🌍',
      gradient: 'gradient-primary'
    },
    {
      title: 'Code Reviews',
      description: 'Streamline code reviews with inline discussions, video walkthroughs, and AI-assisted quality checks.',
      icon: '👁️',
      gradient: 'gradient-secondary'
    },
    {
      title: 'Pair Programming',
      description: 'True pair programming experience with shared cursors, voice chat, and synchronized editing.',
      icon: '👥',
      gradient: 'gradient-accent'
    },
    {
      title: 'Technical Interviews',
      description: 'Conduct live coding interviews with video, real-time code evaluation, and recording capabilities.',
      icon: '💼',
      gradient: 'gradient-primary'
    },
    {
      title: 'Open Source Projects',
      description: 'Collaborate with contributors worldwide. Built-in version control makes contribution seamless.',
      icon: '🌟',
      gradient: 'gradient-secondary'
    },
    {
      title: 'Education & Training',
      description: 'Teach coding interactively. Share your screen, record sessions, and provide real-time feedback.',
      icon: '📚',
      gradient: 'gradient-accent'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create a Session',
      description: 'Start a new collaborative coding session in seconds. Invite your team with a simple link.'
    },
    {
      step: '02',
      title: 'Code Together',
      description: 'Write code in real-time with your team. See live changes, cursors, and get AI-powered suggestions.'
    },
    {
      step: '03',
      title: 'Communicate',
      description: 'Jump into video calls, share your screen, or use voice chat—all without leaving the editor.'
    },
    {
      step: '04',
      title: 'Ship It',
      description: 'Commit your changes, manage branches, and deploy. Version control built right in.'
    }
  ];



  return (
    <div className="landing">
      {/* Navigation */}
      <nav className={`nav ${isNavScrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__container">
          <a href="#" className="nav__logo" aria-label="CollabVoice Home">
            <img src="/logo.jpeg" alt="CollabVoice" className="nav__logo-img" />
            <span className="nav__logo-text">CollabVoice</span>
          </a>

          <div className={`nav__links ${isMobileMenuOpen ? 'nav__links--open' : ''}`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav__link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link to="/login" className="nav__link nav__link--sign-in" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            <div className="nav__actions">
              <Link to="/signup" className="nav__cta nav__cta--primary">Sign Up</Link>
            </div>
          </div>

          <button
            className="nav__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'hamburger--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg">
          <div className="hero__gradient"></div>
          <div className="hero__grid"></div>
          <div className="hero__glow hero__glow--1"></div>
          <div className="hero__glow hero__glow--2"></div>
        </div>

        <div className="hero__container">
          <div className="hero__content">

            <h1 className="hero__title animate-fade-in-up delay-100">
              Code Together.
              <br />
              <span className="hero__title-gradient">Build Together.</span>
              <br />
              Ship Together.
            </h1>

            <p className="hero__subtitle animate-fade-in-up delay-200">
              The all-in-one collaborative code editor with real-time sync,
              AI-powered intelligence, integrated video communication, and
              built-in version control. Revolutionize how your team writes code.
            </p>

            <div className="hero__cta-group animate-fade-in-up delay-200">
              <Link to="/signup" className="btn btn--primary btn--lg">
                <span>Start Coding Free</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="hero__visual animate-fade-in delay-300">
            <div className="solar-system">
              <div className="solar-system__title">Built for Every Team</div>
              <div className="solar-system__core">
                <div className="solar-system__sun">
                  <span className="solar-system__sun-icon">�</span>
                  <div className="solar-system__sun-glow"></div>
                </div>
              </div>

              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`orbit orbit--${index + 1}`}
                >
                  <div className="planet" style={{ '--delay': `${index * 0.5}s` }}>
                    <div className="planet__icon">{feature.icon}</div>
                    <div className="planet__tooltip">
                      <span className="planet__tooltip-title">{feature.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-it-works__container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">
              From Idea to
              <span className="text-gradient"> Deployment</span> in Minutes
            </h2>
            <p className="section-subtitle">
              Get started in seconds. Our intuitive workflow makes collaborative
              coding feel natural and effortless.
            </p>
          </div>

          <div className="how-it-works__timeline">
            {howItWorks.map((step, index) => (
              <div key={index} className="timeline-step">
                <div className="timeline-step__number">
                  <span>{step.step}</span>
                </div>
                <div className="timeline-step__content">
                  <h3 className="timeline-step__title">{step.title}</h3>
                  <p className="timeline-step__description">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="timeline-step__connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-section__container">
          <div className="cta-section__bg">
            <div className="cta-glow cta-glow--1"></div>
            <div className="cta-glow cta-glow--2"></div>
          </div>
          <div className="cta-section__content">
            <h2 className="cta-section__title">
              Ready to Transform How Your Team Codes?
            </h2>
            <p className="cta-section__subtitle">
              Join developers worldwide who are building the future together.
              Start collaborating in real-time today.
            </p>
            <div className="cta-section__actions">
              <Link to="/signup" className="btn btn--primary btn--xl">
                <span>Get Started for Free</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="https://github.com/ashutosh-engineer/collabvoice" className="btn btn--ghost btn--xl">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>View on GitHub</span>
              </a>
            </div>
            <p className="cta-section__note">
              No credit card required • Free forever for personal use • Enterprise plans available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__top">
            <div className="footer__brand">
              <a href="#" className="footer__logo">
                <img src="/logo.jpeg" alt="CollabVoice" className="footer__logo-img" />
                <span className="footer__logo-text">CollabVoice</span>
              </a>
              <p className="footer__tagline">
                Code Together. Build Together. Ship Together.
              </p>
              <div className="footer__social">
                <a href="https://github.com/ashutosh-engineer/collabvoice" className="social-link" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer__links">

              <div className="footer__column">
                <h4 className="footer__column-title">Resources</h4>
                <ul className="footer__list">
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">API Reference</a></li>
                  <li><a href="#">Guides</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>
              <div className="footer__column">
                <h4 className="footer__column-title">Legal</h4>
                <ul className="footer__list">
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                  <li><a href="#">Licenses</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              © 2026 CollabVoice. All rights reserved. Built with ❤️ by developers, for developers.
            </p>
            <p className="footer__made-with">
              <span>Open Source</span>
              <span className="separator">•</span>
              <a href="https://github.com/ashutosh-engineer/collabvoice">MIT License</a>
            </p>
          </div>
        </div >
      </footer >
    </div >
  );
};

export default Landing;

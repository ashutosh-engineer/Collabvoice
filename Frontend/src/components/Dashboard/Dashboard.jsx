import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { 
  GitBranch, 
  Users, 
  Clock, 
  Code, 
  Settings, 
  LogOut, 
  Plus,
  Search,
  Hash,
  Star,
  GitFork,
  Calendar,
  Zap
} from 'lucide-react';
import api from '../../api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [recentCommits, setRecentCommits] = useState([]);
  const [activeSection, setActiveSection] = useState('repos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRepositories();
    }
  }, [user]);

  const loadRepositories = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await api.get('/github/repositories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRepositories(response.data.repositories);
      if (response.data.repositories.length > 0) {
        setSelectedRepo(response.data.repositories[0]);
        loadRepoDetails(response.data.repositories[0].id);
      }
    } catch (error) {
      console.error('Failed to load repositories:', error);
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        logout();
        navigate('/login');
        return;
      }
      
      if (error.response?.status === 400 && error.response?.data?.error?.includes('GitHub access not available')) {
        setError('GitHub access not available. Please connect your GitHub account through OAuth.');
      } else {
        setError('Failed to load repositories. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRepoDetails = async (repoId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        logout();
        navigate('/login');
        return;
      }
      
      // Load collaborators
      const collabResponse = await api.get(`/github/repository/${repoId}/collaborators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollaborators(collabResponse.data.collaborators);

      // Load recent commits
      const commitsResponse = await api.get(`/github/repository/${repoId}/commits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentCommits(commitsResponse.data.commits);
    } catch (error) {
      console.error('Failed to load repository details:', error);
      
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.jpeg" alt="CollabVoice" className="sidebar-logo" />
          <h2>CollabVoice</h2>
        </div>

        <div className="sidebar-nav">
          <div 
            className={`nav-item ${activeSection === 'repos' ? 'active' : ''}`}
            onClick={() => setActiveSection('repos')}
          >
            <GitBranch size={20} />
            <span>Repositories</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'servers' ? 'active' : ''}`}
            onClick={() => setActiveSection('servers')}
          >
            <Hash size={20} />
            <span>Servers</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'collaborators' ? 'active' : ''}`}
            onClick={() => setActiveSection('collaborators')}
          >
            <Users size={20} />
            <span>Collaborators</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'edits' ? 'active' : ''}`}
            onClick={() => setActiveSection('edits')}
          >
            <Clock size={20} />
            <span>Latest Edits</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'autocode' ? 'active' : ''}`}
            onClick={() => setActiveSection('autocode')}
          >
            <Zap size={20} />
            <span>AutoCode</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <img 
              src={user?.avatar_url || '/default-avatar.png'} 
              alt={user?.username} 
              className="user-avatar"
            />
            <div className="user-details">
              <span className="username">{user?.username}</span>
              <span className="user-status">Online</span>
            </div>
          </div>
          
          <div className="sidebar-actions">
            <button className="action-btn" title="Settings">
              <Settings size={18} />
            </button>
            <button className="action-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <div className="header-left">
            <h1>
              {activeSection === 'repos' && 'Repositories'}
              {activeSection === 'servers' && 'Servers'}
              {activeSection === 'collaborators' && 'Collaborators'}
              {activeSection === 'edits' && 'Latest Edits'}
              {activeSection === 'autocode' && 'AutoCode'}
            </h1>
            <p className="header-subtitle">
              {activeSection === 'repos' && 'Manage your GitHub repositories'}
              {activeSection === 'servers' && 'Development servers and environments'}
              {activeSection === 'collaborators' && 'Team members and contributors'}
              {activeSection === 'edits' && 'Recent changes and commits'}
              {activeSection === 'autocode' && 'AI-powered code generation'}
            </p>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
            <button className="btn-primary">
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-body">
          {activeSection === 'repos' && (
            <div className="repos-section">
              {error ? (
                <div className="error-state">
                  <div className="error-icon">⚠️</div>
                  <h3>Unable to Load Repositories</h3>
                  <p>{error}</p>
                  {error.includes('GitHub access not available') && (
                    <button 
                      className="btn-primary"
                      onClick={() => window.location.href = '/login'}
                    >
                      Connect GitHub Account
                    </button>
                  )}
                  <button 
                    className="btn-secondary"
                    onClick={loadRepositories}
                    style={{ marginLeft: '12px' }}
                  >
                    Try Again
                  </button>
                </div>
              ) : repositories.length === 0 ? (
                <div className="empty-state">
                  <GitBranch size={48} />
                  <h3>No Repositories Found</h3>
                  <p>Connect your GitHub account to see your repositories</p>
                  <button className="btn-primary">
                    <Plus size={16} />
                    Connect GitHub
                  </button>
                </div>
              ) : (
                <div className="repos-grid">
                  {repositories.map(repo => (
                    <div 
                      key={repo.id} 
                      className={`repo-card ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedRepo(repo);
                        loadRepoDetails(repo.id);
                      }}
                    >
                      <div className="repo-header">
                        <h3>{repo.name}</h3>
                        {repo.private && <span className="private-badge">Private</span>}
                      </div>
                      <p className="repo-description">
                        {repo.description || 'No description available'}
                      </p>
                      <div className="repo-stats">
                        <span className="stat">
                          <Star size={14} />
                          {repo.stargazers_count}
                        </span>
                        <span className="stat">
                          <GitFork size={14} />
                          {repo.forks_count}
                        </span>
                        {repo.language && (
                          <span className="language">{repo.language}</span>
                        )}
                      </div>
                      <div className="repo-updated">
                        <Calendar size={12} />
                        Updated {formatDate(repo.updated_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'servers' && (
            <div className="servers-section">
              <div className="empty-state">
                <Code size={48} />
                <h3>No Servers Yet</h3>
                <p>Set up development servers for your repositories</p>
                <button className="btn-primary">
                  <Plus size={16} />
                  Add Server
                </button>
              </div>
            </div>
          )}

          {activeSection === 'collaborators' && (
            <div className="collaborators-section">
              <div className="collaborators-grid">
                {collaborators.map(collab => (
                  <div key={collab.id} className="collaborator-card">
                    <img 
                      src={collab.avatar_url} 
                      alt={collab.login} 
                      className="collaborator-avatar"
                    />
                    <div className="collaborator-info">
                      <h4>{collab.login}</h4>
                      <p>Contributor</p>
                    </div>
                    <div className="collaborator-actions">
                      <button className="btn-secondary">View Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'edits' && (
            <div className="edits-section">
              <div className="commits-list">
                {recentCommits.map(commit => (
                  <div key={commit.sha} className="commit-item">
                    <div className="commit-avatar">
                      <img 
                        src={commit.author_info?.avatar_url || '/default-avatar.png'} 
                        alt={commit.author.name}
                      />
                    </div>
                    <div className="commit-details">
                      <p className="commit-message">{commit.message}</p>
                      <div className="commit-meta">
                        <span className="commit-author">{commit.author.name}</span>
                        <span className="commit-date">{formatDate(commit.author.date)}</span>
                        <span className="commit-sha">{commit.sha.substring(0, 7)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'autocode' && (
            <div className="autocode-section">
              <div className="autocode-hero">
                <Zap size={48} />
                <h3>AutoCode AI</h3>
                <p>Generate code, fix bugs, and optimize performance with AI</p>
                <div className="autocode-features">
                  <div className="feature-card">
                    <Code size={24} />
                    <h4>Code Generation</h4>
                    <p>Generate functions, classes, and components</p>
                  </div>
                  <div className="feature-card">
                    <Settings size={24} />
                    <h4>Bug Fixing</h4>
                    <p>Automatically detect and fix common issues</p>
                  </div>
                  <div className="feature-card">
                    <Zap size={24} />
                    <h4>Optimization</h4>
                    <p>Improve code performance and efficiency</p>
                  </div>
                </div>
                <button className="btn-primary btn-large">
                  <Zap size={16} />
                  Start AutoCoding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
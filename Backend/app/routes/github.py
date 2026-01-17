import requests
import logging
from flask import Blueprint, jsonify
from ..models import User
from .auth import token_required

github_bp = Blueprint('github', __name__)
logger = logging.getLogger(__name__)

@github_bp.route('/repositories', methods=['GET'])
@token_required
def get_repositories(current_user):
    """Get user's GitHub repositories"""
    try:
        if not current_user.github_access_token:
            return jsonify({'error': 'GitHub access not available. Please connect your GitHub account.'}), 400
        
        headers = {
            'Authorization': f'token {current_user.github_access_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # Get user's repositories
        repos_url = 'https://api.github.com/user/repos'
        params = {
            'sort': 'updated',
            'per_page': 50,
            'type': 'all'
        }
        
        response = requests.get(repos_url, headers=headers, params=params)
        
        if response.status_code != 200:
            logger.error(f"GitHub API error: {response.status_code} - {response.text}")
            return jsonify({'error': 'Failed to fetch repositories'}), 500
        
        repos = response.json()
        
        # Format repository data
        formatted_repos = []
        for repo in repos:
            formatted_repos.append({
                'id': repo['id'],
                'name': repo['name'],
                'full_name': repo['full_name'],
                'description': repo['description'],
                'private': repo['private'],
                'html_url': repo['html_url'],
                'clone_url': repo['clone_url'],
                'ssh_url': repo['ssh_url'],
                'language': repo['language'],
                'stargazers_count': repo['stargazers_count'],
                'forks_count': repo['forks_count'],
                'updated_at': repo['updated_at'],
                'created_at': repo['created_at'],
                'owner': {
                    'login': repo['owner']['login'],
                    'avatar_url': repo['owner']['avatar_url']
                }
            })
        
        return jsonify({
            'repositories': formatted_repos,
            'total_count': len(formatted_repos)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching repositories: {str(e)}")
        return jsonify({'error': 'Failed to fetch repositories'}), 500

@github_bp.route('/repository/<int:repo_id>/collaborators', methods=['GET'])
@token_required
def get_collaborators(current_user, repo_id):
    """Get collaborators for a specific repository"""
    try:
        if not current_user.github_access_token:
            return jsonify({'error': 'GitHub access not available'}), 400
        
        headers = {
            'Authorization': f'token {current_user.github_access_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # First get the repository details to get the full name
        repo_url = f'https://api.github.com/repositories/{repo_id}'
        repo_response = requests.get(repo_url, headers=headers)
        
        if repo_response.status_code != 200:
            return jsonify({'error': 'Repository not found'}), 404
        
        repo_data = repo_response.json()
        repo_full_name = repo_data['full_name']
        
        # Get collaborators
        collaborators_url = f'https://api.github.com/repos/{repo_full_name}/collaborators'
        response = requests.get(collaborators_url, headers=headers)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch collaborators'}), 500
        
        collaborators = response.json()
        
        formatted_collaborators = []
        for collab in collaborators:
            formatted_collaborators.append({
                'id': collab['id'],
                'login': collab['login'],
                'avatar_url': collab['avatar_url'],
                'html_url': collab['html_url'],
                'permissions': collab.get('permissions', {})
            })
        
        return jsonify({
            'collaborators': formatted_collaborators,
            'repository': {
                'id': repo_data['id'],
                'name': repo_data['name'],
                'full_name': repo_data['full_name']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching collaborators: {str(e)}")
        return jsonify({'error': 'Failed to fetch collaborators'}), 500

@github_bp.route('/repository/<int:repo_id>/commits', methods=['GET'])
@token_required
def get_recent_commits(current_user, repo_id):
    """Get recent commits for a repository"""
    try:
        if not current_user.github_access_token:
            return jsonify({'error': 'GitHub access not available'}), 400
        
        headers = {
            'Authorization': f'token {current_user.github_access_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        # Get repository details
        repo_url = f'https://api.github.com/repositories/{repo_id}'
        repo_response = requests.get(repo_url, headers=headers)
        
        if repo_response.status_code != 200:
            return jsonify({'error': 'Repository not found'}), 404
        
        repo_data = repo_response.json()
        repo_full_name = repo_data['full_name']
        
        # Get recent commits
        commits_url = f'https://api.github.com/repos/{repo_full_name}/commits'
        params = {'per_page': 10}
        response = requests.get(commits_url, headers=headers, params=params)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch commits'}), 500
        
        commits = response.json()
        
        formatted_commits = []
        for commit in commits:
            formatted_commits.append({
                'sha': commit['sha'],
                'message': commit['commit']['message'],
                'author': {
                    'name': commit['commit']['author']['name'],
                    'email': commit['commit']['author']['email'],
                    'date': commit['commit']['author']['date']
                },
                'committer': {
                    'name': commit['commit']['committer']['name'],
                    'date': commit['commit']['committer']['date']
                },
                'html_url': commit['html_url'],
                'author_info': {
                    'login': commit['author']['login'] if commit['author'] else None,
                    'avatar_url': commit['author']['avatar_url'] if commit['author'] else None
                } if commit['author'] else None
            })
        
        return jsonify({
            'commits': formatted_commits,
            'repository': {
                'id': repo_data['id'],
                'name': repo_data['name'],
                'full_name': repo_data['full_name']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching commits: {str(e)}")
        return jsonify({'error': 'Failed to fetch commits'}), 500
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://collabvoice.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(async (config) => {
    // Add JWT token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for mutating requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
        // If we don't have a CSRF token yet, or for every request to be safe
        try {
            // We exclude the csrf-token endpoint itself from this to avoid recursion
            if (!config.url.includes('/auth/csrf-token')) {
                const csrfRes = await axios.get(`${API_BASE_URL}/auth/csrf-token`);
                config.headers['X-CSRFToken'] = csrfRes.data.csrfToken;
            }
        } catch (e) {
            console.error('Could not fetch CSRF token', e);
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

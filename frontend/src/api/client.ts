import axios from 'axios';

// IMPORTANT:
// - Use relative base URL by default so the app works from other machines on the same LAN.
// - In dev, Vite proxies `/api/v1` to the backend.
// - In prod, set `VITE_API_BASE_URL` if the backend is hosted elsewhere.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

// All clients point to the same backend base URL
const AUTH_URL = API_BASE_URL;
const RESIDENTS_URL = API_BASE_URL;
const FEEDBACK_URL = API_BASE_URL;

// Create generic client creator
const createClient = (baseURL: string) => {
    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const userStr = localStorage.getItem('user');
            console.log('[API Debug] userStr from localStorage:', userStr);
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    console.log('[API Debug] Parsed user:', user);
                    if (user.username) {
                        config.headers['X-Username'] = user.username;
                    } else {
                        console.warn('[API Debug] User object has no username property');
                    }
                } catch (e) {
                    console.error('[API Debug] Failed to parse user from localStorage:', e);
                }
            } else {
                console.warn('[API Debug] No user found in localStorage');
            }
            // Final debug logging
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.headers['X-Username'] ? `with user: ${config.headers['X-Username']}` : 'NO USER');

            return config;
        },
        (error) => {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                // Avoid infinite loop if login fails
                if (!window.location.hash.includes('/')) {
                    // logic to force logout if needed
                }
            }
            return Promise.reject(error);
        }
    );

    return client;
};

export const authClient = createClient(AUTH_URL);
export const residentsClient = createClient(RESIDENTS_URL);
export const feedbackClient = createClient(FEEDBACK_URL);

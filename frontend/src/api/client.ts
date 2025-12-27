import axios from 'axios';

// Base URL configuration - specific to each service
// In development, we use proxy or localhost ports.
// Assuming we are running locally for now or using Vite proxy.
const AUTH_URL = 'http://localhost:8017/api/v1';
const RESIDENTS_URL = 'http://localhost:8018/api/v1';
const FEEDBACK_URL = 'http://localhost:8019/api/v1';

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
            return config;
        },
        (error) => {
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

import { authClient } from '../api/client';
import { UserRole } from '../App';

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: {
        id: string;
        username: string;
        role: UserRole;
        scope_id: string;
        active: boolean;
    };
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await authClient.post<LoginResponse>('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    }
};

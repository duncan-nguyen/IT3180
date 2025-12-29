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

export interface User {
    id: string;
    username: string;
    role: string;
    scope_id?: string;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface UserCreateData {
    username: string;
    password: string;
    role: string;
    scope_id?: string;
}

export interface UserUpdateData {
    username?: string;
    role?: string;
    scope_id?: string;
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
            // Ensure username is included in the stored user object
            const userToStore = {
                ...response.data.user,
                username: response.data.user.username || username // Fallback to input username
            };
            localStorage.setItem('user', JSON.stringify(userToStore));
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
    },

    async createUser(data: UserCreateData) {
        const response = await authClient.post('/users', { user: data });
        return response.data;
    },

    async getUsers(): Promise<User[]> {
        const response = await authClient.get<User[]>('/users');
        return response.data;
    },

    async getUserById(id: string): Promise<User> {
        const response = await authClient.get<User>(`/users/${id}`);
        return response.data;
    },

    async updateUser(id: string, data: UserUpdateData) {
        // Backend uses POST /users/{id}
        const response = await authClient.post(`/users/${id}`, { update_data: data });
        return response.data;
    },

    async deleteUser(id: string) {
        // Backend uses DELETE /users/{id}/delete
        const response = await authClient.delete(`/users/${id}/delete`);
        return response.data;
    },

    async lockUser(id: string) {
        // Backend uses POST /users/{id}/lock
        const response = await authClient.post(`/users/${id}/lock`);
        return response.data;
    },

    async unlockUser(id: string) {
        const response = await authClient.put(`/users/${id}/unlock`);
        return response.data;
    },

    async resetPassword(id: string, newPassword: string) {
        // Backend expects POST /{id}/reset-password with { password: { password: newPassword } }
        const response = await authClient.post(`/${id}/reset-password`, {
            password: { password: newPassword }
        });
        return response.data;
    }
};


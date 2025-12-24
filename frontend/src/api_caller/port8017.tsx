// Authentication Service API - Port 8017
const HOST = import.meta.env.VITE_HOST || import.meta.env.HOST || 'localhost';
const BASE_URL = `http://${HOST}:8017`;

// Types
export type UserRole = 'admin' | 'to_truong' | 'can_bo_phuong' | 'nguoi_dan';

export interface AuthRes {
  id: string;
  scope_id: string;
  role: UserRole;
}

export interface LoginRes {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserInfor;
}

export interface UserInfor {
  id: string;
  role: UserRole;
  username: string;
  scope_id: string;
  active: boolean;
}

export interface UserCreateForm {
  password: string;
  role: UserRole;
  username: string;
  scope_id: string;
}

export interface UserUpdateForm {
  role?: UserRole | null;
  scope_id?: string | null;
}

export interface ValidateRequest {
  username: string;
  access_token: string;
}

export interface ResetPasswordForm {
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Helper function for making requests
const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Authentication Endpoints

/**
 * Validate authentication token
 * POST /api/v1/auth/validate
 */
export const validateAuth = async (data: ValidateRequest): Promise<AuthRes> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/validate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Login for access token
 * POST /api/v1/auth/login
 */
export const login = async (username: string, password: string): Promise<LoginRes> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get current user information
 * GET /api/v1/auth/me
 */
export const getMe = async (token: string): Promise<UserInfor> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get all users
 * GET /api/v1/auth/users
 */
export const getUsers = async (token: string): Promise<UserInfor[]> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/users`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Create a new user
 * POST /api/v1/auth/users
 */
export const createUser = async (token: string, user: UserCreateForm): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/users`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ user }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Update a user
 * POST /api/v1/auth/users/{id}
 */
export const updateUser = async (token: string, id: string, updateData: UserUpdateForm): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/users/${id}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ update_data: updateData }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Reset user password
 * POST /api/v1/auth/{id}/reset-password
 */
export const resetPassword = async (token: string, id: string, password: ResetPasswordForm): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/${id}/reset-password`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (refreshTokenData: RefreshTokenRequest): Promise<LoginRes> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ refresh_token: refreshTokenData }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Delete a user
 * DELETE /api/v1/auth/users/{id}/delete
 */
export const deleteUser = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/users/${id}/delete`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Lock a user account
 * POST /api/v1/auth/users/{id}/lock
 */
export const lockUser = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/users/${id}/lock`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Unlock a user account
 * PUT /api/v1/auth/users/{id}/unlock
 */
export const unlockUser = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/users/${id}/unlock`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

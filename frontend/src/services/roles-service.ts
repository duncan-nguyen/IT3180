import { authClient } from '../api/client';

export interface PermissionItem {
    id: string;
    name: string;
    enabled: boolean;
}

export interface PermissionCategory {
    category: string;
    items: PermissionItem[];
}

export interface Role {
    id: number;
    name: string;
    code: string;
    color: string;
    description?: string;
    user_count: number;
    permissions: string[];
}

export interface RoleDetail {
    id: number;
    name: string;
    code: string;
    color: string;
    description?: string;
    user_count: number;
    permissions: PermissionCategory[];
}

export const rolesService = {
    async getAllRoles(): Promise<Role[]> {
        const response = await authClient.get<Role[]>('/roles');
        return response.data;
    },

    async getRoleDetail(roleCode: string): Promise<RoleDetail> {
        const response = await authClient.get<RoleDetail>(`/roles/${roleCode}`);
        return response.data;
    },

    async getRolePermissions(roleCode: string): Promise<string[]> {
        const response = await authClient.get<string[]>(`/roles/${roleCode}/permissions`);
        return response.data;
    }
};

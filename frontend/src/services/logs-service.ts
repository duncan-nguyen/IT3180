import { authClient } from '../api/client';

export interface AuditLog {
    id: string;
    user_id: string | null;
    username: string | null;
    user_role: string | null;
    action: string;
    entity_name: string;
    entity_id: string | null;
    before_state: Record<string, any> | null;
    after_state: Record<string, any> | null;
    timestamp: string;
    ip_address: string | null;
    user_agent: string | null;
}

export interface AuditLogListResponse {
    logs: AuditLog[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface AuditLogStatsResponse {
    today_count: number;
    success_count: number;
    error_count: number;
    unique_users: number;
}

export interface AuditLogFilters {
    page?: number;
    page_size?: number;
    action_type?: string;
    role?: string;
    status?: string;
    search?: string;
}

export const logsService = {
    /**
     * Get paginated list of audit logs with optional filters
     */
    async getLogs(filters: AuditLogFilters = {}): Promise<AuditLogListResponse> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.page_size) params.append('page_size', filters.page_size.toString());
        if (filters.action_type) params.append('action_type', filters.action_type);
        if (filters.role) params.append('role', filters.role);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);

        const response = await authClient.get<AuditLogListResponse>(
            `/audit-logs?${params.toString()}`
        );

        return response.data;
    },

    /**
     * Get statistics for audit logs dashboard
     */
    async getStats(): Promise<AuditLogStatsResponse> {
        const response = await authClient.get<AuditLogStatsResponse>('/audit-logs/stats');
        return response.data;
    },

    /**
     * Get detailed information about a specific audit log
     */
    async getLogDetail(logId: string): Promise<AuditLog> {
        const response = await authClient.get<AuditLog>(`/audit-logs/${logId}`);
        return response.data;
    }
};

import { residentsClient } from '../api/client';

export interface Resident {
    id: string;
    full_name: string;
    date_of_birth: string;
    cccd_number: string;
    place_of_birth?: string;
    hometown?: string;
    ethnicity?: string;
    occupation?: string;
    workplace?: string;
    cccd_issue_date?: string;
    cccd_issue_place?: string;
    residence_registration_date?: string;
    relationship_to_head?: string;
    household_id?: string;
    household?: {
        id: string;
        address: string;
    };
}

export interface ResidentCreateData {
    full_name: string;
    date_of_birth: string;
    cccd_number: string;
    household_id: string;
    place_of_birth?: string;
    hometown?: string;
    ethnicity?: string;
    occupation?: string;
    workplace?: string;
    cccd_issue_date?: string;
    cccd_issue_place?: string;
    residence_registration_date?: string;
    relationship_to_head?: string;
}

export interface ResidentUpdateData {
    full_name?: string;
    date_of_birth?: string;
    cccd_number?: string;
    household_id?: string;
    place_of_birth?: string;
    hometown?: string;
    ethnicity?: string;
    occupation?: string;
    workplace?: string;
    cccd_issue_date?: string;
    cccd_issue_place?: string;
    residence_registration_date?: string;
    relationship_to_head?: string;
}

export interface ResidentListParams {
    q?: string;
    page?: number;
    limit?: number;
}

export const residentsService = {
    async getAll(params: ResidentListParams = {}) {
        const response = await residentsClient.get<{
            data: Resident[];
            pagination: { total: number; page: number; limit: number };
        }>('/residents', { params });
        return response.data;
    },

    async search(query: string) {
        const response = await residentsClient.get<{ data: Resident[] }>('/residents/search', {
            params: { q: query }
        });
        return response.data.data;
    },

    async getById(id: string) {
        const response = await residentsClient.get<{ data: Resident }>(`/residents/${id}`);
        return response.data.data;
    },

    async create(data: ResidentCreateData) {
        const response = await residentsClient.post<{ data: Resident }>('/residents/', data);
        return response.data.data;
    },

    async update(id: string, data: ResidentUpdateData) {
        const response = await residentsClient.put<{ data: Resident }>(`/residents/${id}`, data);
        return response.data.data;
    },

    async delete(id: string) {
        const response = await residentsClient.delete<{ data: boolean }>(`/residents/${id}`);
        return response.data.data;
    },

    async getMovementLogs(id: string) {
        const response = await residentsClient.get<{ data: any[] }>(`/residents/${id}/lich-su-bien-dong`);
        return response.data.data;
    },

    async getResidentsCount(toId?: string, phuongId?: string) {
        const params: Record<string, string> = {};
        if (toId) params.to_id = toId;
        if (phuongId) params.phuong_id = phuongId;
        const response = await residentsClient.get<{ data: number }>('/residents/count', { params });
        return response.data.data;
    },

    // ==================== CITIZEN SELF-SERVICE METHODS ====================

    /**
     * Get current citizen's information
     */
    async getMyInfo() {
        const response = await residentsClient.get<{ data: Resident }>('/residents/me');
        return response.data.data;
    },

    /**
     * Update current citizen's non-critical information
     */
    async updateMyInfo(data: CitizenSelfUpdateData) {
        const response = await residentsClient.put<{ data: Resident; message: string }>('/residents/me', data);
        return response.data;
    },

    /**
     * Change current citizen's password
     */
    async changeMyPassword(oldPassword: string, newPassword: string) {
        const response = await residentsClient.post<{ message: string }>('/residents/me/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        });
        return response.data;
    }
};

/**
 * Data for citizen to update their own non-critical information
 */
export interface CitizenSelfUpdateData {
    place_of_birth?: string;
    hometown?: string;
    ethnicity?: string;
    occupation?: string;
    workplace?: string;
}

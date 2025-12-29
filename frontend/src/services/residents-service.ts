import { residentsClient } from '../api/client';

export interface Resident {
    id: string;
    full_name: string;
    date_of_birth: string;
    cccd_number: string;
    gender?: string;
    phone_number?: string;
    ethnic?: string;
    religion?: string;
    occupation?: string;
    education_level?: string;
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
    gender?: string;
    phone_number?: string;
    ethnic?: string;
    religion?: string;
    occupation?: string;
    education_level?: string;
    relationship_to_head?: string;
    household_id?: string;
}

export interface ResidentUpdateData {
    full_name?: string;
    date_of_birth?: string;
    cccd_number?: string;
    gender?: string;
    phone_number?: string;
    ethnic?: string;
    religion?: string;
    occupation?: string;
    education_level?: string;
    relationship_to_head?: string;
    household_id?: string;
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
        const response = await residentsClient.post<{ data: Resident }>('/residents', data);
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
    }
};

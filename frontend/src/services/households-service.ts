import { residentsClient } from '../api/client';

export interface Household {
    id: string;
    household_number?: string;
    address: string;
    phuong_xa?: string;
    quan_huyen?: string;
    tinh_thanh?: string;
    head_id?: string;
    head_name?: string;
    scope_id?: string;
    nhan_khau?: HouseholdMember[];
    created_at?: string;
    updated_at?: string;
}

export interface HouseholdMember {
    id: string;
    full_name: string;
    date_of_birth: string;
    relationship_to_head: string;
}

export interface HouseholdListParams {
    q?: string;
    phuong_xa?: string;
    page?: number;
    limit?: number;
}

export interface HouseholdCreateData {
    address: string;
    phuong_xa?: string;
    quan_huyen?: string;
    tinh_thanh?: string;
    head_id?: string;
    scope_id?: string;
}

export interface HouseholdUpdateData {
    address?: string;
    phuong_xa?: string;
    quan_huyen?: string;
    tinh_thanh?: string;
    head_id?: string;
}

export const householdsService = {
    async getHouseholdsList(params: HouseholdListParams = {}) {
        const response = await residentsClient.get<{
            data: Household[];
            pagination: { page: number; limit: number; count: number };
        }>('/households', { params });
        return response.data;
    },

    async getHouseholdById(id: string) {
        const response = await residentsClient.get<{ data: Household }>(`/households/${id}`);
        return response.data.data;
    },

    async createHousehold(data: HouseholdCreateData) {
        const response = await residentsClient.post<{ data: Household }>('/households', data);
        return response.data.data;
    },

    async updateHousehold(id: string, data: HouseholdUpdateData) {
        const response = await residentsClient.put<{ data: Household }>(`/households/${id}`, data);
        return response.data.data;
    },

    async deleteHousehold(id: string) {
        const response = await residentsClient.delete<{ data: boolean }>(`/households/${id}`);
        return response.data.data;
    },

    async getMyHousehold() {
        const response = await residentsClient.get<{ data: Household }>('/households/me/info');
        return response.data.data;
    },

    async getHouseholdCount(toId?: string, phuongId?: string) {
        const params: Record<string, string> = {};
        if (toId) params.to_id = toId;
        if (phuongId) params.phuong_id = phuongId;
        const response = await residentsClient.get<{ data: number }>('/households/count', { params });
        return response.data.data;
    }
};

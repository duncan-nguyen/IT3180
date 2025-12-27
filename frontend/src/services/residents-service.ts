import { residentsClient } from '../api/client';

export interface Resident {
    id: string;
    full_name: string;
    date_of_birth: string;
    cccd_number: string;
    household?: {
        address: string;
    };
}

export const residentsService = {
    async search(query: string) {
        const response = await residentsClient.get<{ data: Resident[] }>('/residents/search', {
            params: { q: query }
        });
        return response.data.data;
    },

    async getById(id: string) {
        const response = await residentsClient.get<{ data: Resident }>(`/residents/${id}`);
        return response.data.data;
    }
};

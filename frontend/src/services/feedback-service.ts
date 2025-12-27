import { feedbackClient } from '../api/client';

export interface Feedback {
    id: string;
    title?: string; // Derived or optional
    content: string;
    category: string;
    status: string;
    scope_id?: string;
    report_count: number;
    created_at: string;
    updated_at: string;
    created_by_user_id: string;
    parent_id?: string;
    // Relations or extra fields from API
    feedback_responses?: FeedbackResponse[];
}

export interface FeedbackResponse {
    id: string;
    content: string;
    agency: string;
    attachment_url?: string;
    feedback_id: string;
    responded_at: string;
    created_by_user_id: string;
}

export interface FeedbackParams {
    status?: string;
    category?: string;
    start_date?: string;
    end_date?: string;
    q?: string;
}

export interface FeedbackResponsePayload {
    noi_dung: string;
    co_quan: string;
    tep_dinh_kem_url?: string;
}

export const feedbackService = {
    getAllFeedbacks: async (params?: FeedbackParams) => {
        const response = await feedbackClient.get('/feedback', { params });
        // The API returns { stt_feedback: string, data: Feedback }[]
        // We probably want just the data array for the UI, or handle the wrapper.
        // Looking at backend router:
        // returns [{"stt_feedback": str(index), "data": record}, ...]
        return response.data;
    },

    getFeedbackById: async (id: string) => {
        const response = await feedbackClient.get(`/feedback/${id}`);
        return response.data;
    },

    updateFeedbackStatus: async (id: string, status: string) => {
        const response = await feedbackClient.put(`/feedback/${id}`, { trang_thai: status });
        return response.data;
    },

    respondToFeedback: async (id: string, payload: FeedbackResponsePayload) => {
        const response = await feedbackClient.post(`/feedback/${id}/response`, payload);
        return response.data;
    }
};

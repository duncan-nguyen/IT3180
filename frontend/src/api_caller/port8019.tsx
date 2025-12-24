// Feedback Service API - Port 8019
const HOST = import.meta.env.VITE_HOST || import.meta.env.HOST || 'localhost';
const BASE_URL = `http://${HOST}:8019`;

// Types
export type Status = 'MOI_GHI_NHAN' | 'DANG_XU_LY' | 'DA_GIAI_QUYET' | 'DONG';
export type Category = 'HA_TANG' | 'AN_NINH' | 'MOI_TRUONG' | 'KHAC';
export type QUY = 1 | 2 | 3 | 4;
export type Format = 'json' | 'pdf' | 'excel';

export interface NguoiPhanAnh {
  nhankhau_id?: string | null;
  ho_ten_tu_do?: string | null;
}

export interface PostedFB {
  noi_dung: string;
  phan_loai: Category;
  nguoi_phan_anh: NguoiPhanAnh;
}

export interface FeedBack {
  trang_thai: Status;
}

export interface FBResponse {
  noi_dung: string;
  co_quan: string;
  tep_dinh_kem_url: string;
}

export interface MergedFB {
  parent_id?: string | null;
  sub_id: string[];
}

export interface FeedbackListParams {
  status?: Status | null;
  category?: Category | null;
  start_date?: string | null; // format: "YYYY-MM-DD"
  update_date?: string | null; // format: "YYYY-MM-DD"
  q?: string | null;
}

export interface ReportByStatusParams {
  quy: QUY;
  nam: number;
  format?: Format;
}

export interface ReportsParams {
  quy?: QUY | null;
  nam?: number | null;
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

// Feedback Endpoints

/**
 * Get feedback list with optional filters
 * GET /api/v1/feedback
 */
export const getFeedbackList = async (token: string, params?: FeedbackListParams): Promise<any> => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.start_date) searchParams.append('start_date', params.start_date);
  if (params?.update_date) searchParams.append('update_date', params.update_date);
  if (params?.q) searchParams.append('q', params.q);
  
  const url = searchParams.toString() 
    ? `${BASE_URL}/api/v1/feedback?${searchParams}` 
    : `${BASE_URL}/api/v1/feedback`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Create new feedback
 * POST /api/v1/feedback
 */
export const createFeedback = async (token: string, data: PostedFB): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/feedback`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get feedback by ID
 * GET /api/v1/feedback/{feedback_id}
 */
export const getFeedbackById = async (token: string, feedbackId: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/feedback/${feedbackId}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Update feedback status
 * PUT /api/v1/feedback/{feedback_id}
 */
export const updateFeedback = async (token: string, feedbackId: string, data: FeedBack): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/feedback/${feedbackId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Create feedback response
 * POST /api/v1/feedback/{feedback_id}/response
 */
export const createFeedbackResponse = async (token: string, feedbackId: string, data: FBResponse): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/feedback/${feedbackId}/response`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Merge feedback
 * POST /api/v1/feedback/merge
 */
export const mergeFeedback = async (token: string, data: MergedFB): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/feedback/merge`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Reports Endpoints

/**
 * Get amount of feedback by status (kiennghi-theo-trangthai)
 * GET /api/v1/reports/kiennghi-theo-trangthai
 */
export const getAmountFbByStatus = async (token: string, params: ReportByStatusParams): Promise<any> => {
  const searchParams = new URLSearchParams();
  searchParams.append('quy', params.quy.toString());
  searchParams.append('nam', params.nam.toString());
  if (params.format) searchParams.append('format', params.format);
  
  const response = await fetch(`${BASE_URL}/api/v1/reports/kiennghi-theo-trangthai?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get reports
 * GET /api/v1/reports
 */
export const getReports = async (token: string, params?: ReportsParams): Promise<any> => {
  const searchParams = new URLSearchParams();
  if (params?.quy) searchParams.append('quy', params.quy.toString());
  if (params?.nam) searchParams.append('nam', params.nam.toString());
  
  const url = searchParams.toString() 
    ? `${BASE_URL}/api/v1/reports?${searchParams}` 
    : `${BASE_URL}/api/v1/reports`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Health check
 * GET /health
 */
export const healthCheck = async (): Promise<any> => {
  const response = await fetch(`${BASE_URL}/health`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Test auth
 * GET /test-auth
 */
export const testAuth = async (): Promise<any> => {
  const response = await fetch(`${BASE_URL}/test-auth`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

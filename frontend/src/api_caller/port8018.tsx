// Residents Service API - Port 8018
const HOST = import.meta.env.VITE_HOST || import.meta.env.HOST || 'localhost';
const BASE_URL = `http://${HOST}:8018`;

// Types
export interface NhankhauCreate {
  household_id: string;
  full_name: string;
  date_of_birth: string; // format: "YYYY-MM-DD"
  place_of_birth?: string | null;
  hometown?: string | null;
  ethnicity?: string | null;
  occupation?: string | null;
  workplace?: string | null;
  cccd_number: string;
  cccd_issue_date?: string | null;
  cccd_issue_place?: string | null;
  residence_registration_date?: string | null;
  relationship_to_head?: string | null;
}

export interface NhankhauUpdate {
  household_id?: string | null;
  full_name?: string | null;
  date_of_birth?: string | null;
  place_of_birth?: string | null;
  hometown?: string | null;
  ethnicity?: string | null;
  occupation?: string | null;
  workplace?: string | null;
  cccd_number?: string | null;
  cccd_issue_date?: string | null;
  cccd_issue_place?: string | null;
  residence_registration_date?: string | null;
  relationship_to_head?: string | null;
}

export interface HokhauCreate {
  household_number: string;
  head_of_household_id?: string | null;
  address: string;
  ward: string;
}

export interface HokhauUpdate {
  household_number?: string | null;
  head_of_household_id?: string | null;
  address?: string | null;
  ward?: string | null;
  scope_id?: string | null;
  updated_at?: string | null;
}

export interface HouseholdListParams {
  q?: string | null;
  phuong_xa?: string | null;
  page?: number;
  limit?: number;
}

export interface CountParams {
  to_id?: string | null;
  phuong_id?: string | null;
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

// Residents Endpoints

/**
 * Search citizens by name or CCCD number
 * GET /api/v1/residents/search
 */
export const searchResidents = async (token: string, q: string): Promise<any> => {
  const params = new URLSearchParams({ q });
  const response = await fetch(`${BASE_URL}/api/v1/residents/search?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[searchResidents] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Count total citizens
 * GET /api/v1/residents/count
 */
export const countResidents = async (token: string, params?: CountParams): Promise<any> => {
  const searchParams = new URLSearchParams();
  if (params?.to_id) searchParams.append('to_id', params.to_id);
  if (params?.phuong_id) searchParams.append('phuong_id', params.phuong_id);
  
  const url = searchParams.toString() 
    ? `${BASE_URL}/api/v1/residents/count?${searchParams}` 
    : `${BASE_URL}/api/v1/residents/count`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[countResidents] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Create new citizen
 * POST /api/v1/residents/
 */
export const createResident = async (token: string, data: NhankhauCreate): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/residents/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[createResident] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get citizen information with ID
 * GET /api/v1/residents/{id}
 */
export const getResidentById = async (token: string, id: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/residents/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[getResidentById] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Update citizen information
 * PUT /api/v1/residents/{id}
 */
export const updateResident = async (token: string, id: string, data: NhankhauUpdate): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/residents/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[updateResident] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Soft delete a citizen with ID
 * DELETE /api/v1/residents/{id}
 */
export const deleteResident = async (token: string, id: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/residents/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[deleteResident] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get movement logs of a citizen
 * GET /api/v1/residents/{id}/lich-su-bien-dong
 */
export const getResidentMovementLogs = async (id: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/residents/${id}/lich-su-bien-dong`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[getResidentMovementLogs] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Households Endpoints

/**
 * Count total households
 * GET /api/v1/households/count
 */
export const countHouseholds = async (token: string, params?: CountParams): Promise<any> => {
  const searchParams = new URLSearchParams();
  if (params?.to_id) searchParams.append('to_id', params.to_id);
  if (params?.phuong_id) searchParams.append('phuong_id', params.phuong_id);
  
  const url = searchParams.toString() 
    ? `${BASE_URL}/api/v1/households/count?${searchParams}` 
    : `${BASE_URL}/api/v1/households/count`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[countHouseholds] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get household list
 * GET /api/v1/households/
 */
export const getHouseholdList = async (token: string, params?: HouseholdListParams): Promise<any> => {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.append('q', params.q);
  if (params?.phuong_xa) searchParams.append('phuong_xa', params.phuong_xa);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const url = searchParams.toString() 
    ? `${BASE_URL}/api/v1/households/?${searchParams}` 
    : `${BASE_URL}/api/v1/households/`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[getHouseholdList] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Create new household
 * POST /api/v1/households/
 */
export const createHousehold = async (token: string, data: HokhauCreate): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/households/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[createHousehold] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Get household information with ID
 * GET /api/v1/households/{id}
 */
export const getHouseholdById = async (token: string, id: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/households/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[getHouseholdById] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Update household information
 * PUT /api/v1/households/{id}
 */
export const updateHousehold = async (token: string, id: string, data: HokhauUpdate): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/households/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[updateHousehold] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Soft delete a household with ID
 * DELETE /api/v1/households/{id}
 */
export const deleteHousehold = async (token: string, id: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/v1/households/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[deleteHousehold] HTTP error! status: ${response.status}`, errorText);
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
    const errorText = await response.text();
    console.error(`[healthCheck] HTTP error! status: ${response.status}`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

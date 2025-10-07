// Configuration constants for the frontend application

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    PROPERTIES: '/api/admin/properties',
    USER_ACTION: (userId: string, action: string) => `/api/admin/users/${userId}/${action}`,
    PROPERTY_ACTION: (propertyId: string, action: string) => `/api/admin/properties/${propertyId}/${action}`,
  },
  PROPERTIES: {
    LIST: '/api/properties',
    DETAILS: (id: string) => `/api/properties/${id}`,
    SEARCH: '/api/properties/search',
    TRENDING: '/api/properties/trending',
  },
  INQUIRIES: {
    CREATE: '/api/inquiries',
    LIST: '/api/inquiries',
  },
} as const;

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};
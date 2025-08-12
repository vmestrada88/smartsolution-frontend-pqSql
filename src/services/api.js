// Central API configuration with environment override
// Priority: VITE_API_URL env -> window.__RUNTIME_API_URL (optional future) -> default localhost
const rawBase = (import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.__RUNTIME_API_URL) || 'http://localhost:5000/api');
// Normalize: remove trailing slash
const normalizedBase = rawBase.replace(/\/$/, '');

export const API_CONFIG = {
  BASE_URL: normalizedBase,
  ENDPOINTS: {
    CLIENTS: '/clients',
    PRODUCTS: '/products',
    INVOICES: '/invoices',
    AUTH: '/auth'
  }
};

// Common fetch configuration
export const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function for API calls with basic offline fallback option
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  let response;
  try {
    response = await fetch(url, { ...fetchConfig, ...options });
  } catch (networkErr) {
    throw new Error('API Network Error');
  }
  if (!response.ok) {
    // Try to parse JSON error if available
    let detail;
    try { detail = await response.json(); } catch (_) {}
    throw new Error(detail?.error || `API Error: ${response.status}`);
  }
  return await response.json();
};

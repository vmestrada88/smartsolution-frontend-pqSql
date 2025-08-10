// Central API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
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

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...fetchConfig,
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return await response.json();
};

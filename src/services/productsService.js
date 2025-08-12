import { API_CONFIG, fetchConfig } from './api';

const BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`;

export const fetchProducts = async () => {
  const res = await fetch(BASE, { ...fetchConfig });
  if (!res.ok) throw new Error('Error fetching products');
  return res.json();
};

export const createProduct = async (productData) => {
  const res = await fetch(BASE, {
    method: 'POST',
    ...fetchConfig,
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Error creating product');
  return res.json();
};

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    ...fetchConfig,
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Error updating product');
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting product');
  return res.json();
};

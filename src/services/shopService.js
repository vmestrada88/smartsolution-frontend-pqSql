/**
 * Shop service module for handling cart and order API operations.
 * @module services/shopService
 */
import { API_CONFIG, fetchConfig } from './api';

const CART_BASE = `${API_CONFIG.BASE_URL}/cart`;
const ORDERS_BASE = `${API_CONFIG.BASE_URL}/orders`;

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...fetchConfig.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Cart ────────────────────────────────────────────────────
export const fetchCart = async () => {
  const res = await fetch(CART_BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await fetch(CART_BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateCartItem = async (id, quantity) => {
  const res = await fetch(`${CART_BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const removeCartItem = async (id) => {
  const res = await fetch(`${CART_BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ─── Orders ──────────────────────────────────────────────────
export const createOrder = async (shippingAddress) => {
  const res = await fetch(ORDERS_BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ shippingAddress }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(ORDERS_BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const fetchOrder = async (id) => {
  const res = await fetch(`${ORDERS_BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

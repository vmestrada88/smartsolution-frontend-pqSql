/**
 * Invoice Service
 * API calls for invoice management
 */

import { API_CONFIG, fetchConfig } from './api';

const BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}`;

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...fetchConfig.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Get all invoices
 * @returns {Promise<Array>} List of all invoices
 */
export const fetchInvoices = async () => {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Get invoice by ID
 * @param {number} id - Invoice ID
 * @returns {Promise<Object>} Invoice details
 */
export const fetchInvoiceById = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Create new invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>} Created invoice
 */
export const createInvoice = async (invoiceData) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(invoiceData)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Update invoice
 * @param {number} id - Invoice ID
 * @param {Object} invoiceData - Updated invoice data
 * @returns {Promise<Object>} Updated invoice
 */
export const updateInvoice = async (id, invoiceData) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(invoiceData)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Delete invoice
 * @param {number} id - Invoice ID
 * @returns {Promise<void>}
 */
export const deleteInvoice = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

import { API_CONFIG, fetchConfig } from './api';

const BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTS}`;

export const fetchClients = async () => {
  const res = await fetch(BASE, { ...fetchConfig });
  if (!res.ok) throw new Error('Error fetching clients');
  return res.json();
};

export const createClient = async (clientData) => {
  const res = await fetch(BASE, {
    method: 'POST',
    ...fetchConfig,
    body: JSON.stringify(clientData)
  });
  if (!res.ok) throw new Error('Error creating client');
  return res.json();
};

export const updateClient = async (id, clientData) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    ...fetchConfig,
    body: JSON.stringify(clientData)
  });
  if (!res.ok) throw new Error('Error updating client');
  return res.json();
};

export const deleteClient = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting client');
  return res.json();
};

export const getClientById = async (id) => {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Error fetching client');
  return res.json();
};

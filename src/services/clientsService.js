/**
 * Client service module for handling client-related API operations.
 * 
 * @module services/clientsService
 * @description Provides methods for fetching, creating, updating, and deleting clients.
 */
import { API_CONFIG, fetchConfig } from './api';

const BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTS}`;

/**
 * Fetches all clients from the API.
 * 
 * @async
 * @function fetchClients
 * @returns {Promise<Array>} Promise resolving to an array of client objects.
 * @throws {Error} If there's an error fetching clients.
 */
export const fetchClients = async () => {
  const res = await fetch(BASE, { ...fetchConfig });
  if (!res.ok) throw new Error('Error fetching clients');
  return res.json();
};

/**
 * Creates a new client.
 * 
 * @async
 * @function createClient
 * @param {Object} clientData - Client data object.
 * @param {string} clientData.name - Client name.
 * @param {string} [clientData.email] - Client email.
 * @param {string} [clientData.phone] - Client phone.
 * @param {string} [clientData.address] - Client address.
 * @returns {Promise<Object>} Promise resolving to the created client object.
 * @throws {Error} If there's an error creating the client.
 */
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

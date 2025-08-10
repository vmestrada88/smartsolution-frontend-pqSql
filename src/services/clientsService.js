// API service for clients
const API_URL = 'http://localhost:5000/api/clients';

export const fetchClients = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error fetching clients');
  return await response.json();
};

export const createClient = async (clientData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error('Error creating client');
  return await response.json();
};

export const updateClient = async (id, clientData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error('Error updating client');
  return await response.json();
};

export const deleteClient = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting client');
  return await response.json();
};

export const getClientById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Error fetching client');
  return await response.json();
};

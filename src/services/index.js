// Barrel exports for services
export { fetchProducts } from './productsService';
export { API_BASE, api, apiMultipart, extractError } from './httpClient';
export { fetchClients, createClient, updateClient, deleteClient, getClientById } from './clientsService';
export { API_CONFIG, fetchConfig, apiCall } from './api';
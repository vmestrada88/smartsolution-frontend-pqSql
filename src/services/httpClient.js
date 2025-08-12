import axios from 'axios';

export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export const apiMultipart = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'multipart/form-data' }
});

export function extractError(err) {
  return err?.response?.data?.error ||
         err?.response?.data?.message ||
         err.message ||
         'Unknown error';
}
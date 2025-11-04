/**
 * HTTP client configuration module.
 * 
 * @module services/httpClient
 * @description Configures and exports axios instances for API communication,
 *              with preconfigured base URL and headers. Also provides error extraction utility.
 */
import axios from 'axios';

/**
 * Base API URL determined from environment variables or defaulting to localhost.
 * Removes trailing slashes for consistency.
 * @constant {string}
 */
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

/**
 * Configured axios instance for JSON API requests.
 * @constant {Object}
 */
export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Configured axios instance for multipart form data (file uploads).
 * @constant {Object}
 */
export const apiMultipart = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'multipart/form-data' }
});

/**
 * Extracts meaningful error messages from various error response formats.
 * 
 * @function extractError
 * @param {Error|Object} err - Error object from a failed request
 * @returns {string} Human-readable error message
 */
export function extractError(err) {
  return err?.response?.data?.error ||
         err?.response?.data?.message ||
         err.message ||
         'Unknown error';
}
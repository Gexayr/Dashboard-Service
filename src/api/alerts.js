import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

/**
 * Fetch alerts from API.
 * 
 * @param {Object} params - Query parameters.
 * @returns {Promise} - Response from API.
 */
export const getAlerts = (params) => api.get('/api/alerts', { params });

/**
 * Fetch alert statistics from API.
 * 
 * @param {Object} params - Query parameters.
 * @returns {Promise} - Response from API.
 */
export const getAlertStats = (params) => api.get('/api/alerts/stats', { params });

export default api;

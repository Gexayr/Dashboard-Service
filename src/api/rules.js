import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

/**
 * Fetch all rules.
 * @returns {Promise}
 */
export const getRules = () => api.get('/api/rules');

/**
 * Create a new rule.
 * @param {Object} data - Rule data.
 * @returns {Promise}
 */
export const createRule = (data) => api.post('/api/rules', data);

/**
 * Update an existing rule.
 * @param {string|number} id - Rule ID.
 * @param {Object} data - Updated rule data.
 * @returns {Promise}
 */
export const updateRule = (id, data) => api.put(`/api/rules/${id}`, data);

/**
 * Delete a rule.
 * @param {string|number} id - Rule ID.
 * @returns {Promise}
 */
export const deleteRule = (id) => api.delete(`/api/rules/${id}`);

/**
 * Toggle a rule's enabled status.
 * @param {string|number} id - Rule ID.
 * @returns {Promise}
 */
export const toggleRule = (id) => api.post(`/api/rules/${id}/toggle`);

export default api;

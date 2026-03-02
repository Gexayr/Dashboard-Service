import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const getEvents = (params) => api.get('/dashboard/events', { params });
export const getStats = (params) => api.get('/dashboard/stats', { params });

export default api;

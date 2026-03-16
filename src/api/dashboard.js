import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const getEvents = (params) => api.get('/api/dashboard/events', { params });
export const getStats = (params) => api.get('/api/dashboard/stats', { params });
export const getRiskOverTime = (params) => api.get('/api/dashboard/risk-over-time', { params });
export const getRiskDistribution = (params) => api.get('/api/dashboard/risk-distribution', { params });
export const getEventsPerClient = (params) => api.get('/api/dashboard/events-per-client', { params });
export const getClients = () => api.get('/api/clients');
export const getClientProfile = (id) => api.get(`/api/clients/${id}`);

export default api;

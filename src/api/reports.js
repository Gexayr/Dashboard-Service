import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const getReports = () => api.get('/api/reports');
export const getReportDetails = (id) => api.get(`/api/reports/${id}`);
export const generateReport = (data) => api.post('/api/reports/generate', data);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const getEventDetails = (id) => api.get(`/api/events/${id}`);

export default {
  getEventDetails,
};

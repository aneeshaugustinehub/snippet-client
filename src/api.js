import axios from 'axios';

const api = axios.create({
  VITE_BASE_URL: '/',
});

export const getUsers = () => api.get('/users').then(r => r.data);
export const getPosts = () => api.get('/Posts').then(r => r.data);

export default api;
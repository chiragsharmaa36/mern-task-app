import axios from 'axios';

// Base API URL — change if your server runs on another host/port
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export default api;

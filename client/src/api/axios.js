import axios from 'axios';

// Base API URL — change if your server runs on another host/port
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export default api;

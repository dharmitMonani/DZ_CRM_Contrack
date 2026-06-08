import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dz_crm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dz_crm_token');
      localStorage.removeItem('dz_crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me')
};

// ─── Dashboard ───────────────────────────────────────────
export const dashboardAPI = {
  get: () => api.get('/dashboard')
};

// ─── Leads ───────────────────────────────────────────────
export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`)
};

export default api;

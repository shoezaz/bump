import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
    apiClient.post('/auth/register', data),
};

// Watches API
export const watchesAPI = {
  getAll: (ownerId?: string) =>
    apiClient.get('/watches', { params: { ownerId } }),
  getById: (id: string) =>
    apiClient.get(`/watches/${id}`),
  getBySerial: (serialNumber: string) =>
    apiClient.get(`/watches/serial/${serialNumber}`),
  create: (data: any) =>
    apiClient.post('/watches', data),
  update: (id: string, data: any) =>
    apiClient.put(`/watches/${id}`, data),
  getHistory: (id: string) =>
    apiClient.get(`/watches/${id}/history`),
  addHistory: (id: string, data: any) =>
    apiClient.post(`/watches/${id}/history`, data),
};

// Transfers API
export const transfersAPI = {
  getAll: () =>
    apiClient.get('/transfers'),
  getById: (id: string) =>
    apiClient.get(`/transfers/${id}`),
  getByToken: (token: string) =>
    apiClient.get(`/transfers/token/${token}`),
  create: (data: { watchId: string; fromUserId: string }) =>
    apiClient.post('/transfers', data),
  updateStatus: (id: string, status: string, toUserId?: string) =>
    apiClient.put(`/transfers/${id}/status`, { status, toUserId }),
};

// Reports API
export const reportsAPI = {
  getAll: () =>
    apiClient.get('/reports'),
  getById: (id: string) =>
    apiClient.get(`/reports/${id}`),
  getByWatch: (watchId: string) =>
    apiClient.get(`/reports/watch/${watchId}`),
  create: (data: any) =>
    apiClient.post('/reports', data),
  update: (id: string, data: any) =>
    apiClient.put(`/reports/${id}`, data),
};

// Users API
export const usersAPI = {
  getAll: () =>
    apiClient.get('/users'),
  getById: (id: string) =>
    apiClient.get(`/users/${id}`),
  update: (id: string, data: any) =>
    apiClient.put(`/users/${id}`, data),
};

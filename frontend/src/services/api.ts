import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: any) => api.post('/api/auth/register', userData),
  login: (credentials: any) => api.post('/api/auth/login', credentials),
  googleLogin: (userData: any) => api.post('/api/auth/google-login', userData),
  adminLogin: (credentials: any) => api.post('/api/auth/admin-login', credentials),
  getCurrentUser: () => api.get('/api/auth/me'),
};

export const assessmentAPI = {
  getAssessments: (params?: any) => api.get('/api/assessments', { params }),
  getAssessment: (id: string) => api.get(`/api/assessments/${id}`),
  submitAssessment: (data: any) => api.post('/api/assessments/submit', data),
  getMySubmissions: () => api.get('/api/assessments/submissions/my'),
};

export const userAPI = {
  updateProfile: (data: any) => api.put('/api/users/profile', data),
  getProgress: () => api.get('/api/users/progress'),
  updateGoals: (data: any) => api.put('/api/users/goals', data),
};

export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: () => api.get('/api/admin/users'),
  getAssessments: () => api.get('/api/admin/assessments'),
  createAssessment: (data: any) => api.post('/api/admin/assessments', data),
  updateAssessment: (id: string, data: any) => api.put(`/api/admin/assessments/${id}`, data),
  deleteAssessment: (id: string) => api.delete(`/api/admin/assessments/${id}`),
  getSubmissions: () => api.get('/api/admin/submissions'),
  getReports: () => api.get('/api/admin/reports'),
};

export default api;

import axios from 'axios';

// Types
interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserData {
  email: string;
  username: string;
  password: string;
}

interface ModelData {
  name: string;
  description: string;
  file?: File;
}

interface ScaleData {
  replicas: number;
  resources: {
    cpu: string;
    memory: string;
  };
}

interface OrganizationData {
  name: string;
  description: string;
}

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://51.20.140.171:3000";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication functions
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post<LoginResponse>('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);
  return response.data;
};

export const registerUser = async (data: UserData) => {
  const response = await api.post('/users/', data);
  return response.data;
};

// Model management functions
export const getModels = async () => {
  const response = await api.get('/models/');
  return response.data;
};

export const uploadModel = async (data: ModelData) => {
  const formData = new FormData();
  if (data.file) {
    formData.append('file', data.file);
  }
  formData.append('name', data.name);
  formData.append('description', data.description);
  
  const response = await api.post('/models/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deployModel = async (modelId: string, cloudProvider: 'AWS' | 'GCP' | 'Azure') => {
  const response = await api.post('/deployments/', {
    model_id: modelId,
    cloud_provider: cloudProvider,
  });
  return response.data;
};

export const getModelMetrics = async (modelId: string) => {
  const response = await api.get(`/models/${modelId}/metrics`);
  return response.data;
};

export const scaleModel = async (modelId: string, scaleData: ScaleData) => {
  const response = await api.post(`/models/${modelId}/scale`, scaleData);
  return response.data;
};

export const deleteModel = async (modelId: string) => {
  const response = await api.delete(`/models/${modelId}`);
  return response.data;
};

export const createOrganization = async (orgData: OrganizationData) => {
  const response = await api.post('/organizations/', orgData);
  return response.data;
}; 
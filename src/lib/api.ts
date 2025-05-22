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
  organization_id?: number;
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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://c847-51-20-140-171.ngrok-free.app";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add timeout and other production settings
  timeout: 10000,
  withCredentials: false
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add origin header
  config.headers['Origin'] = window.location.origin;
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
  try {
    const response = await api.post('/users/', {
      ...data,
      organization_id: data.organization_id || 0  // American spelling
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
    throw error;
  }
};

// Model management functions
export const getModels = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Log the API URL being used
    console.log('Fetching models from:', `${API_BASE_URL}/models/`);

    const response = await api.get('/models/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Origin': window.location.origin
      }
    });

    // Log the full response for debugging
    console.log("Full Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object' && 'models' in response.data) {
      return response.data.models;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error details:', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 422) {
        throw new Error(data?.detail || 'Invalid request format');
      } else if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication required');
      } else if (status === 403) {
        throw new Error('Access denied');
      } else if (status === 404) {
        throw new Error('Models endpoint not found');
      } else if (status === 500) {
        throw new Error('Server error');
      }
      
      throw new Error(data?.detail || 'Failed to fetch models');
    }
    throw error;
  }
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
import axios, { AxiosError } from 'axios';

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
  model_type: string;
  version: string;
  docker_image: string;
  config: object;
  resource_limits: object;
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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://f663-51-20-140-171.ngrok-free.app";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add timeout and other production settings
  timeout: 10000,
  // Ensure we get JSON responses
  responseType: 'json'
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Ensure proper headers for JSON
  config.headers['Accept'] = 'application/json';
  config.headers['Content-Type'] = 'application/json';
  
  // Log request details for debugging
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    baseURL: config.baseURL
  });
  
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    // Check if response is HTML
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML response:', response.data);
      throw new Error('Received HTML response instead of JSON. Please check your API endpoint.');
    }
    
    console.log('Response received:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    
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
  if (!access_token) {
    throw new Error('No access token received from server');
  }
  
  // Store token and log for debugging
  localStorage.setItem('token', access_token);
  console.log('Token stored in localStorage:', access_token);
  
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Making request to:', `${API_BASE_URL}/models/`);
    
    const response = await api.get('/models/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return Array.isArray(response.data) ? response.data : 
           (response.data.models || []);
           
  } catch (error) {
    console.error('getModels error:', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (status === 422) {
        console.error('Validation error:', data);
        throw new Error(data?.detail || 'Invalid request format');
      }
      
      throw new Error(data?.detail || 'Failed to fetch models');
    }
    throw error;
  }
};

export const uploadModel = async (data: ModelData) => {
  console.log('uploadModel received data:', data);
  try {
    const response = await api.post('/models/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Upload model error details:', {
      error: String(error),
      response: axiosError?.response?.data,
      status: axiosError?.response?.status,
      headers: axiosError?.response?.headers
    });
    if (axios.isAxiosError(error)) {
      // Pass backend validation errors up for toast display
      const errorMessage = error.response?.data?.detail || 'Failed to upload model.';
      console.error('Validation error:', errorMessage);
      throw new Error(errorMessage);
    }
    throw error;
  }
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
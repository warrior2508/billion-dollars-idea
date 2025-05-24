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
  timeout: 10000
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ensure proper Bearer token format
    config.headers.Authorization = `Bearer ${token.trim()}`;
    // Ensure proper content type for JSON
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
  } else {
    // Remove auth headers if no token
    delete config.headers.Authorization;
  }
  
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
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    console.log('Attempting login with:', { username });

    const response = await api.post<LoginResponse>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Validate response data
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response from server');
    }

    const { access_token, token_type } = response.data;
    
    if (!access_token) {
      console.error('No access token in response:', response.data);
      throw new Error('No access token received from server');
    }

    if (token_type !== 'bearer') {
      console.warn('Unexpected token type:', token_type);
    }
    
    // Store token and log for debugging
    localStorage.setItem('token', access_token);
    console.log('Token stored in localStorage:', access_token);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 422) {
        // Handle validation errors
        const validationErrors = data?.detail || 'Invalid credentials';
        console.error('Validation error:', validationErrors);
        throw new Error(validationErrors);
      }

      if (status === 401) {
        throw new Error('Invalid username or password');
      }

      throw new Error(data?.detail || 'Login failed. Please try again.');
    }
    throw error;
  }
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
      console.error('No authentication token found in localStorage');
      window.location.href = '/login';
      throw new Error('Authentication required. Please log in.');
    }

    // Validate token format
    if (!token.trim()) {
      console.error('Invalid token format - empty or whitespace only');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Invalid authentication token. Please log in again.');
    }

    console.log('Making request to:', `${API_BASE_URL}/models/`);
    
    const response = await api.get('/models/', {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status < 500 // Accept all responses except 5xx errors
    });

    // Check if response is HTML (indicating an error page)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML response:', response.data);
      throw new Error('Received HTML response instead of JSON. Check API endpoint configuration.');
    }

    // Handle different response status codes
    if (response.status === 401) {
      console.error('Authentication failed - invalid or expired token');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please log in again.');
    }

    if (response.status === 403) {
      throw new Error('You do not have permission to access this resource.');
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    // Ensure we're returning an array of models
    const models = Array.isArray(response.data) ? response.data : 
                  (response.data.models || []);
    
    console.log('Successfully fetched models:', models);
    return models;
           
  } catch (error) {
    console.error('getModels error:', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 401) {
        console.error('Authentication failed - invalid or expired token');
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
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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 10000,
  responseType: 'json'
});

// Interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['ngrok-skip-browser-warning'] = 'true';
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';
  
  
  // Log request details for debugging

  // Log request details for debugging
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    baseURL: config.baseURL
  });

  return config;
});

api.interceptors.response.use(
  (response) => {
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

// API Functions
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  console.log("Form data:", formData.toString());

  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/token`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'ngrok-skip-browser-warning': 'true'
      },
      transformRequest: [(data) => data],
    });

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (data: UserData) => {
  try {
    const response = await api.post('/users', {
      ...data,
      organization_id: data.organization_id || 0
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
    throw error;
  }
};

export const getModels = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await api.get('/models', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });

    return Array.isArray(response.data) ? response.data : (response.data.models || []);
  } catch (error) {
    console.error('getModels error details:', {
      error,
      isAxiosError: axios.isAxiosError(error),
      status: axios.isAxiosError(error) ? error.response?.status : null,
      data: axios.isAxiosError(error) ? error.response?.data : null
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }

      if (status === 422) {
        const validationErrors = data?.detail || data?.errors || data;
        const errorMessage = typeof validationErrors === 'object'
          ? Object.entries(validationErrors).map(([k, v]) => `${k}: ${v}`).join(', ')
          : 'Invalid request format';
        throw new Error(errorMessage);
      }

      throw new Error(data?.detail || 'Failed to fetch models');
    }

    throw error;
  }
};

export const uploadModel = async (data: ModelData) => {
  console.log('uploadModel received data:', data);
  try {
    const response = await api.post('/models', data, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Upload model error details:', {
      error: String(error),
      response: axiosError?.response?.data,
      status: axiosError?.response?.status
    });
    if (axios.isAxiosError(error)) {
      const errorMessage = (axiosError.response?.data as { detail?: string })?.detail || 'Failed to upload model.';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const deployModel = async (modelId: string, cloudProvider: 'AWS' | 'GCP' | 'Azure') => {
  const response = await api.post('/deployments', {
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
  const response = await api.post('/organizations', orgData);
  return response.data;
};
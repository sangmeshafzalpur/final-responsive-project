import axios from 'axios';

// Dynamically resolve API URL from environment variables during build/runtime
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return 'http://localhost:8000/api';
};

const API_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
});

export const checkHealth = () => api.get('/health');
export const getModelInfo = () => api.get('/model-info');
export const getClasses = () => api.get('/classes');
export const getStatistics = () => api.get('/statistics');

export const predictDisease = (imageFile, generateGradcam = true) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  return api.post(`/predict?generate_gradcam=${generateGradcam}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;

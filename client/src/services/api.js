import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Attach token to all requests IF it exists
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const executeQuery = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, {
      question: question
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error occurred' };
  }
};

export const getSchema = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schema`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch schema' };
  }
};

export const getTables = async () => { // NEW
  try {
    const response = await axios.get(`${API_BASE_URL}/tables`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch tables' };
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Backend is not responding' };
  }
};

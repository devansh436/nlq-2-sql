import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Backend is not responding' };
  }
};

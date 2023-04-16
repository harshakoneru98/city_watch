import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const fetchMetaData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

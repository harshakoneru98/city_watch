import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/';

export const fetchMetaData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

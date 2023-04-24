import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_SERVER_URL;

// Get Axios Request
export const getAxiosRequest = async (endpoint: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Post Axios Request
export const postAxiosRequest = async (endpoint: string, data: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

// Fetch the Metadata Information of Zipcodes
export const fetchMetaData = async (endpoint: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Create User
export const createUser = async (endpoint: string, data: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.message;
    } catch (error) {
        throw error;
    }
};

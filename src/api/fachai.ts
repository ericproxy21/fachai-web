import axios, { AxiosInstance } from 'axios';



const apiUrl = process.env.REACT_APP_FACHAI_API_URL ;
// Create an instance of Axios with base URL
const api: AxiosInstance = axios.create({
  baseURL: apiUrl ?? 'https://fachai-backend.onrender.com/api/'
});

export const chat = async (message: string) => {
  try {
    const response = await api.post('chat', {
      message: message
    });

    // Assuming you want to return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error connecting to API:', error);
  }
};

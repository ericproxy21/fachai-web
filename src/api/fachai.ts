import axios, { AxiosInstance } from 'axios';



const apiUrl = process.env.REACT_APP_FACHAI_API_URL ;
// Create an instance of Axios with base URL
const api: AxiosInstance = axios.create({
  baseURL: apiUrl ?? 'https://fachai-backend.onrender.com/api/'
});


export const helloWorld = async () => {
  try {
    const response = await api.get('testConnection', {
    });

    // Assuming you want to return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error connecting to API:', error);
  }
}

export const chat = async (message: string, historyKey: string, language: string) => {
  try {
    const response = await api.post('chat', {
      message: message,
      historyKey: historyKey,
      language: language
    });

    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error connecting to API:', error);
  }
};

export const setupSession = async () => {
  try {
    const response = await api.post('setupSession');
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error connecting to API:', error);
  }
};


export const ratePerformance = async (historyKey: string, language: string) => {
  try {
    const response = await api.post('ratePerformance', {
      historyKey: historyKey,
      language: language
    });

    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error connecting to API:', error);
  }
};

export const rateLanguage = async (historyKey: string, language: string) => {
  try {
    const response = await api.post('rateLanguage', {
      historyKey: historyKey,
      language: language
    });

    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error connecting to API:', error);
  }
};
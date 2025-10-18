import axios from 'axios';

// Centralized API configuration
export const createApiClient = (baseURL: string, timeout = 10000) => {
  const client = axios.create({
    baseURL,
    timeout,
  });

  // Add global error handling (only if needed)
  if (import.meta.env.DEV) {
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(`API Error [${baseURL}]:`, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  return client;
};

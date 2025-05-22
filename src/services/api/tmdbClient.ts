/**
 * TMDB API client configuration
 * Implements Factory Pattern for creating configured axios instance
 */
import axios, { AxiosInstance } from 'axios';
import config from '../../utils/config';

interface TMDBClientConfig {
  baseURL: string;
  timeout: number;
  params: {
    api_key: string;
    language: string;
  };
}

/**
 * Creates a configured axios instance for TMDB API
 * Follows Factory Pattern for consistent API client creation
 */
export const createTMDBClient = (): AxiosInstance => {  const clientConfig: TMDBClientConfig = {
    baseURL: config.TMDB_BASE_URL,
    timeout: 10000,
    params: {
      api_key: config.TMDB_API_KEY,
      language: 'en-US'
    }
  };

  const instance = axios.create(clientConfig);

  // Add request interceptor for error handling
  instance.interceptors.request.use(
    (config) => {
      // You could add authentication headers here if needed
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.status_message || 'An error occurred with the API');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('API No Response:', error.request);
        throw new Error('No response received from the API');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Request Error:', error.message);
        throw new Error('Error setting up the request');
      }
    }
  );

  return instance;
};
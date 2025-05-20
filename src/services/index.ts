import axios, { AxiosInstance } from 'axios';
import config from '../utils/config';

const BASE_URL = config.BASE_URL;
const API_KEY = config.API_KEY;

// Create an Axios instance with pre-configured settings
const tmdbApiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    // language: 'en-US', // Optional default language
  },
});

interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

interface DiscoverMoviesOptions {
  genreId?: number;
  page?: number;
  sortBy?: string;
}

export const getData = (endpoint: string, params: RequestParams = {}) => {
  // Clone the axios instance configuration
  // const modifiedInstance: AxiosInstance = axios.create(tmdbApiClient.defaults);

  // Handle API key inclusion
  const requestParams = { ...params };
  // requestParams.api_key = API_KEY;

  return tmdbApiClient.get(endpoint, { params: requestParams });
};

// --- API Functions using getData adapter ---

/**
 * Fetches the list of movie genres.
 * @returns {Promise<object>} A promise that resolves to the genre list response.
 */
export const getGenres = () => {
  return getData('/genre/movie/list');
};

/**
 * Discovers movies, optionally filtered by genre and page.
 * @param {DiscoverMoviesOptions} options - The options for discovering movies.
 * @returns {Promise<object>} A promise that resolves to the discovered movies response.
 */
export const discoverMovies = ({ genreId, page = 1, sortBy = 'popularity.desc' }: DiscoverMoviesOptions = {}) => {
  const params: RequestParams = {
    page,
    sort_by: sortBy,
  };
  if (genreId) {
    params.with_genres = genreId;
  }
  return getData('/discover/movie', params);
};

/**
 * Fetches movies for a specific genre.
 * @param {number} genreId - The ID of the genre.
 * @param {number} [page=1] - The page number of results.
 * @returns {Promise<object>} A promise that resolves to the movies for the genre.
 */
export const getMoviesByGenre = (genreId: number, page: number = 1) => {
  return discoverMovies({ genreId, page });
};

/**
 * Fetches popular movies.
 * @param {number} [page=1] - The page number of results.
 * @returns {Promise<object>} A promise that resolves to the popular movies response.
 */
export const getPopularMovies = (page: number = 1) => {
  return discoverMovies({ page, sortBy: 'popularity.desc' });
};

/**
 * Fetches details for a specific movie.
 * @param {number|string} movieId - The ID of the movie.
 * @param {string} [appendToResponse] - Comma-separated list of extra data (e.g., 'videos,credits').
 * @returns {Promise<object>} A promise that resolves to the movie details.
 */
export const getMovieDetails = (movieId: number | string, appendToResponse: string = '') => {
  const params: RequestParams = {};
  if (appendToResponse) {
    params.append_to_response = appendToResponse;
  }
  return getData(`/movie/${movieId}`, params);
};

/**
 * Fetches similar movies for a given movie ID.
 * @param {number|string} movieId - The ID of the movie.
 * @param {number} [page=1] - The page number of results.
 * @returns {Promise<object>} A promise that resolves to the similar movies response.
 */
export const getSimilarMovies = (movieId: number | string, page: number = 1) => {
  return getData(`/movie/${movieId}/similar`, { page });
};

/**
 * Fetches recommended movies for a given movie ID.
 * @param {number|string} movieId - The ID of the movie.
 * @param {number} [page=1] - The page number of results.
 * @returns {Promise<object>} A promise that resolves to the recommended movies response.
 */
export const getMovieRecommendations = (movieId: number | string, page: number = 1) => {
  return getData(`/movie/${movieId}/recommendations`, { page });
};

/**
 * Searches for movies.
 * @param {string} query - The search query.
 * @param {number} [page=1] - The page number of results.
 * @returns {Promise<object>} A promise that resolves to the search results.
 */
export const searchMovies = (query: string, page: number = 1) => {
  return getData('/search/movie', { query, page });
};

export default tmdbApiClient;

/**
 * Application configuration constants
 * Uses environment variables for sensitive data
 */

// Jest and Node do not support import.meta.env, so we provide a fallback for tests.
const config = {
  // API Configuration
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_API_KEY: typeof process !== 'undefined' && process.env && process.env.TMDB_API_KEY
    ? process.env.TMDB_API_KEY
    : (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TMDB_API_KEY)
      ? import.meta.env.VITE_TMDB_API_KEY
      : "c690875459b832a92edf8348e191a681",
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',

  // UI Configuration
  SEARCH_DEBOUNCE_DELAY: 700, // milliseconds
  ITEMS_PER_PAGE: 20,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  // Local Storage Keys
  STORAGE_KEYS: {
    FAVORITES: 'favorites',
    DARK_MODE: 'darkMode',
    WELCOME_SEEN: 'hasSeenWelcome',
    GENRES_CACHE: 'cachedGenres',
    GENRES_TIMESTAMP: 'genresCachedAt'
  } as const
};

export default config;

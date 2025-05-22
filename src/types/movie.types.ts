/**
 * Types definition file for movie-related data
 * Centralizes all movie-related type definitions
 */

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number;
  backdrop_path: string | null;
  videos: {
    results: Video[];
  };
  credits: {
    cast: CastMember[];
  };
  similar: {
    results: Movie[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieResponse<T> {
  results: T[];
  total_results: number;
  page: number;
  total_pages: number;
}

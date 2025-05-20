import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../services';
import { useTheme } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';
import NavBar from '../components/NavBar';
import Section from '../components/ui/Section';
import MovieHero from '../components/ui/MovieHero';
import MovieTrailer from '../components/ui/MovieTrailer';
import MovieCastGrid from '../components/ui/MovieCastGrid';
import MovieCard from '../components/MovieCard';
import { MovieDetailSkeleton } from '../components/SkeletonLoader';
import NoResults from '../components/ui/NoResults';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  videos: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  similar: {
    results: Array<{
      id: number;
      title: string;
      poster_path: string;
      release_date: string;
      vote_average: number;
    }>;
  };
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { darkMode } = useTheme();
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when movie changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const { data } = await getData(`/movie/${id}`, {
          append_to_response: 'credits,similar,videos'
        });
        setMovie(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <MovieDetailSkeleton />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <NoResults
        title="Error"
        message={error || 'Movie not found'}
        className="py-10"
      />
    );
  }

  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = () => {
    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: [], // This field might not be needed for favorites
        overview: movie.overview
      });
    }
  };

  const trailer = movie.videos.results.find(
    video => video.site === 'YouTube' && video.type === 'Trailer'
  ) || movie.videos.results.find(
    video => video.site === 'YouTube'
  );

  return (
    <main className={`flex-grow ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <NavBar />

      <MovieHero
        title={movie.title}
        overview={movie.overview}
        backdropPath={movie.backdrop_path}
        posterPath={movie.poster_path}
        releaseDate={movie.release_date}
        runtime={movie.runtime}
        rating={movie.vote_average}
        genres={movie.genres}
        isFavorite={isMovieFavorite}
        onFavoriteClick={handleFavoriteClick}
      />

      {trailer && (
        <Section title="Trailer">
          <MovieTrailer
            videoKey={trailer.key}
            title={trailer.name}
          />
        </Section>
      )}

      <Section title="Cast">
        <MovieCastGrid cast={movie.credits.cast} />
      </Section>

      {movie.similar.results.length > 0 && (
        <Section title="Similar Movies" className="pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movie.similar.results.slice(0, 4).map(similarMovie => (
              <MovieCard 
                key={similarMovie.id} 
                movie={{
                  ...similarMovie,
                  genre_ids: [],
                  overview: '',
                  vote_average: typeof similarMovie.vote_average === 'number' && !isNaN(similarMovie.vote_average) 
                    ? similarMovie.vote_average 
                    : 0
                }} 
              />
            ))}
          </div>
        </Section>
      )}
    </main>
  );
};

export default MovieDetail;
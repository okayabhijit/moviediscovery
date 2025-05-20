import React from 'react';
import { useFilters } from '../context/FilterContext';

interface Genre {
  id: number;
  name: string;
}

const GenreButtons: React.FC = () => {
  const { selectedGenre, selectedGenreId, setSelectedGenre, genres, isLoadingGenres } = useFilters();

  if (isLoadingGenres) {
    return <div className="flex justify-center">Loading genres...</div>;
  }

  const handleGenreClick = (genre: Genre | null) => {
    if (genre === null) {
      setSelectedGenre('All', null);
    } else {
      setSelectedGenre(genre.name, genre.id);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <button 
        onClick={() => handleGenreClick(null)} 
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedGenreId === null
            ? 'bg-indigo-600 dark:bg-purple-700 text-white' 
            : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      
      {genres.map(genre => (
        <button
          key={genre.id}
          onClick={() => handleGenreClick(genre)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedGenreId === genre.id
              ? 'bg-indigo-600 dark:bg-purple-700 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreButtons;
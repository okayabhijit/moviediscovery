import React from 'react';

interface MovieTrailerProps {
  videoKey: string;
  title: string;
  className?: string;
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({
  videoKey,
  title,
  className = '',
}) => {
  return (
    <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default MovieTrailer;

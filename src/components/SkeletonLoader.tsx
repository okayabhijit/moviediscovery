import React from 'react';
type SkeletonProps = {
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = ''
}) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`} />;

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div 
      data-testid="movie-card-skeleton"
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full"
    >
      <Skeleton className="h-64 w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-1/2 mb-4 rounded" />
        <Skeleton className="h-4 w-1/4 rounded" />
      </div>
    </div>
  );
};

export const MovieDetailSkeleton: React.FC = () => <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
    <div className="md:flex">
      <div className="md:w-1/3">
        <Skeleton className="h-[500px] w-full" />
      </div>
      <div className="md:w-2/3 p-6">
        <Skeleton className="h-8 w-3/4 mb-4 rounded" />
        <Skeleton className="h-4 w-1/2 mb-6 rounded" />
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-3/4 mb-6 rounded" />
        <Skeleton className="h-6 w-1/4 mb-2 rounded" />
        <Skeleton className="h-4 w-1/2 mb-6 rounded" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
        </div>
      </div>
    </div>
    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
      <Skeleton className="h-[400px] w-full rounded" />
    </div>
  </div>;
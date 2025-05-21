import React from 'react';

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}) => {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  const gapStyles = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div 
      className={`grid ${columnStyles[columns]} ${gapStyles[gap]} ${className}`}
      data-testid="grid"
    >
      {children}
    </div>
  );
};

export default Grid;

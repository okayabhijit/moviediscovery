import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ value, className = '' }) => {
  const formatRating = (val: number): string => {
    if (typeof val !== 'number' || isNaN(val)) return 'N/A';
    return val.toFixed(1);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star size={16} className="text-yellow-500" fill="currentColor" />
      <span>{formatRating(value)}</span>
    </div>
  );
};

export default Rating;

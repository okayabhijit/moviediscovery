import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface NoResultsProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionLink?: string;
  className?: string;
}

const NoResults: React.FC<NoResultsProps> = ({
  title,
  message,
  icon,
  actionLabel,
  actionLink,
  className = '',
}) => {  return (
    <div className={`text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {icon && (
        <div className="flex justify-center items-center mb-4">
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {message}
      </p>
      {actionLabel && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NoResults;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
  backButtonLabel?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  showBackButton = false,
  backButtonLabel = 'Back',
  className = '',
}) => {
  return (
    <div className={`flex justify-between items-center mb-8 ${className}`}>
      {showBackButton ? (
        <Link 
          to="/" 
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span>{backButtonLabel}</span>
        </Link>
      ) : <div />}

      <h1 className="text-2xl font-bold flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </h1>

      {/* Placeholder div to maintain centering when no back button */}
      {!showBackButton && <div />}
    </div>
  );
};

export default PageHeader;

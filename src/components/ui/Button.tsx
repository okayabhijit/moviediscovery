import React from 'react';
import { Loader2Icon } from 'lucide-react';

/**
 * Props for the Button component.
 * - Follows SRP: Only handles rendering and UI logic for a button.
 * - Decoupled from business logic.
 */
export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  isLoading?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable, theme-aware button component.
 * - Follows SOLID and OOAD best practices.
 * - Modular and maintainable.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  onClick,
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  // Base styles for all buttons
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus:outline-none';

  // Variant styles
  const variants = {
    primary: 'bg-indigo-600 dark:bg-purple-700 text-white hover:bg-indigo-700 dark:hover:bg-purple-800',
    secondary: 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700',
    outline: 'border-2 border-indigo-600 dark:border-purple-700 text-indigo-600 dark:text-purple-700 hover:bg-indigo-50 dark:hover:bg-purple-900/10',
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const width = fullWidth ? 'w-full' : '';
  const disabledStyles = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${width}
        ${disabledStyles}
        ${className}
      `}
      type="button"
    >
      {isLoading ? (
        <>
          <Loader2Icon className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

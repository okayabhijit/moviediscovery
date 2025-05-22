import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Base interface for common component props
 */
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

/**
 * Props interface for components that can have a loading state
 */
export interface WithLoadingProps extends BaseProps {
  isLoading?: boolean;
  loadingComponent?: ReactNode;
}

/**
 * Props interface for components that can have an error state
 */
export interface WithErrorProps extends BaseProps {
  error?: string | null;
  errorComponent?: ReactNode;
}

/**
 * HOC to add loading state handling to any component
 * Implements Decorator Pattern for adding loading functionality
 */
export function withLoading<P extends WithLoadingProps>(
  WrappedComponent: React.ComponentType<P>,
  DefaultLoadingComponent: React.ComponentType<BaseProps>
) {
  return function WithLoadingComponent(props: P) {
    const { isLoading, loadingComponent, className, ...rest } = props;
    const combinedClassName = twMerge('w-full', className);

    if (isLoading) {
      return loadingComponent ? (
        <div className={combinedClassName}>{loadingComponent}</div>
      ) : (
        <DefaultLoadingComponent className={combinedClassName} />
      );
    }

    // Filter out 'key' prop to avoid React warning and stack overflow
    const { key, ...restWithoutKey } = rest as any;
    return <WrappedComponent className={combinedClassName} {...(restWithoutKey as P)} />;
  };
}

/**
 * HOC to add error handling to any component
 * Implements Decorator Pattern for adding error handling functionality
 */
export function withError<P extends WithErrorProps>(
  WrappedComponent: React.ComponentType<P>,
  DefaultErrorComponent: React.ComponentType<BaseProps & { message?: string }>
) {
  return function WithErrorComponent(props: P) {
    const { error, errorComponent, className, ...rest } = props;
    const combinedClassName = twMerge('w-full', className);

    if (error) {
      return errorComponent ? (
        <div className={combinedClassName}>{errorComponent}</div>
      ) : (
        <DefaultErrorComponent className={combinedClassName} message={error} />
      );
    }

    // Filter out 'key' prop to avoid React warning and stack overflow
    const { key, ...restWithoutKey } = rest as any;
    return <WrappedComponent className={combinedClassName} {...(restWithoutKey as P)} />;
  };
}

/**
 * Combines multiple HOCs into a single HOC
 * Implements Composite Pattern for combining multiple behaviors
 */
export function compose(...funcs: Function[]) {
  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}
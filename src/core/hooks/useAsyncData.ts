import { use, useMemo } from 'react';

/**
 * Custom hook that wraps React's `use` hook to handle async data fetching.
 * This hook is designed to be used with React's Suspense and ErrorBoundary.
 * 
 * @param asyncFunction - The async function that returns a promise
 * @param args - Arguments to pass to the async function
 * @returns The resolved value from the promise
 */
export function useAsyncData<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  ...args: Args
): T {
  // Memorizar la promesa para evitar crear una nueva en cada renderizado
  const promise = useMemo(() => {
    return asyncFunction(...args);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, ...args]);
  
  // Use React's `use` hook to handle the promise
  return use(promise);
}

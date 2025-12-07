import { useRef } from "react";

/**
 * Custom hook to debounce a function call.
 *
 * @param callback - The function to debounce.
 * @param timeout - The debounce delay in milliseconds (default is 300ms).
 * @returns A debounced function.
 */
const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  timeout: number = 300
) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debounceFunction = (...args: Parameters<T>) => {
    // Clear the previous timer if it exists
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Set a new debounce timer
    debounceRef.current = setTimeout(() => {
      callback(...args);
    }, timeout);
  };

  return debounceFunction;
};

export default useDebounce;

import { useEffect, useRef } from 'react';

/**
 * Robust interval hook with guaranteed cleanup
 * Prevents stale closures by updating callback ref on every render
 *
 * @param callback - Function to execute at each interval
 * @param delay - Delay in milliseconds (null to disable)
 * @param enabled - Whether the interval should run
 * @returns Ref to the interval ID for manual control if needed
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref on every render (avoids stale closures)
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || delay === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [delay, enabled]);

  return intervalRef;
}

import { useState, useEffect, useCallback } from 'react';

// Debounce function to limit the rate at which a function can fire.
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useShake = (onShake: () => void, shakeThreshold = 10) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleDeviceMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) {
        return;
      }

      const { x, y, z } = accelerationIncludingGravity;
      if (x === null || y === null || z === null) {
        return;
      }

      const magnitude = Math.sqrt(x * x + y * y + z * z);

      if (magnitude > shakeThreshold) {
        setIsShaking(true);
      }
    },
    [shakeThreshold]
  );

  const debouncedOnShake = useCallback(debounce(onShake, 500), [onShake]);

  useEffect(() => {
    if (isShaking) {
      debouncedOnShake();
      // Reset shaking state after a delay
      const timer = setTimeout(() => setIsShaking(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isShaking, debouncedOnShake]);

  useEffect(() => {
    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [handleDeviceMotion]);

  return isShaking;
};

import { useState, useEffect, useCallback, useRef } from 'react';

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

export const useShake = (onShake: () => void, shakeFactor = 3, calibrationDuration = 3000) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [baselineGravity, setBaselineGravity] = useState<number | null>(null);
  const magnitudes = useRef<number[]>([]).current;

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

      const currentMagnitude = Math.sqrt(x * x + y * y + z * z);

      if (isCalibrating) {
        magnitudes.push(currentMagnitude);
      } else if (baselineGravity) {
        const shakeThreshold = baselineGravity * shakeFactor;
        if (currentMagnitude > shakeThreshold) {
          setIsShaking(true);
        }
      }
    },
    [isCalibrating, baselineGravity, shakeFactor, magnitudes]
  );

  // Calibration effect
  useEffect(() => {
    const calibrationTimer = setTimeout(() => {
      if (magnitudes.length > 0) {
        const average = magnitudes.reduce((sum, val) => sum + val, 0) / magnitudes.length;
        setBaselineGravity(average);
      } else {
        // Fallback for devices that don't report motion events quickly
        setBaselineGravity(9.8); 
      }
      setIsCalibrating(false);
      magnitudes.length = 0; // Clear the array
    }, calibrationDuration);

    return () => clearTimeout(calibrationTimer);
  }, [calibrationDuration, magnitudes]);

  const debouncedOnShake = useCallback(debounce(onShake, 500), [onShake]);

  useEffect(() => {
    if (isShaking) {
      debouncedOnShake();
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

  return { isCalibrating };
};

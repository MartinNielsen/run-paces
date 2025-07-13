import { useState, useEffect } from 'react';
import simplify from 'simplify-js';
import { Activity } from '../types/activity';

const useSimplifiedActivities = (activities: Activity[], zoom: number) => {
  const [simplifiedActivities, setSimplifiedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const tolerance = 0.001 / Math.pow(2, zoom);
    const newSimplifiedActivities = activities.map(activity => {
      const points = activity.coordinates.map(coord => ({ x: coord[0], y: coord[1] }));
      const simplifiedPoints = simplify(points, tolerance, true);
      const newCoordinates = simplifiedPoints.map(point => [point.x, point.y] as [number, number]);
      return { ...activity, coordinates: newCoordinates };
    });
    setSimplifiedActivities(newSimplifiedActivities);
  }, [activities, zoom]);

  return simplifiedActivities;
};

export default useSimplifiedActivities;
import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Activity } from '../types/activity';

interface CurrentPositionMarkerProps {
  activities: Activity[];
  currentTime: number;
}

const CurrentPositionMarker = ({ activities, currentTime }: CurrentPositionMarkerProps) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    let pos: LatLngExpression | null = null;
    for (const activity of activities) {
      // Find the segment of the track where the currentTime falls
      const timeIndex = activity.timestamps.findIndex((t, i) => {
        if (i === 0) return false;
        const prevTimestamp = activity.timestamps[i - 1];
        return currentTime >= prevTimestamp && currentTime <= t;
      });

      if (timeIndex > 0) {
        const prevTimestamp = activity.timestamps[timeIndex - 1];
        const nextTimestamp = activity.timestamps[timeIndex];
        const prevCoord = activity.coordinates[timeIndex - 1];
        const nextCoord = activity.coordinates[timeIndex];

        // Avoid division by zero
        if (nextTimestamp > prevTimestamp) {
          const ratio = (currentTime - prevTimestamp) / (nextTimestamp - prevTimestamp);
          const lat = prevCoord[0] + (nextCoord[0] - prevCoord[0]) * ratio;
          const lng = prevCoord[1] + (nextCoord[1] - prevCoord[1]) * ratio;
          pos = [lat, lng];
        } else {
          // If timestamps are the same, just use the coordinate
          pos = prevCoord as LatLngExpression;
        }
        break; // Found the position, no need to check other activities
      }
    }
    setPosition(pos);
  }, [activities, currentTime]);

  if (!position) {
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default CurrentPositionMarker;

import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { Activity } from '../types/activity';

// --- Direct Icon Import & Creation ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new Icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// --- End of Fix ---

interface CurrentPositionMarkerProps {
  activities: Activity[];
  currentTime: number;
}

const CurrentPositionMarker = ({ activities, currentTime }: CurrentPositionMarkerProps) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  // --- DEBUG LOGGING ---
  console.log(`[Marker] Received currentTime: ${new Date(currentTime).toISOString()}`);

  useEffect(() => {
    let pos: LatLngExpression | null = null;
    for (const activity of activities) {
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

        if (nextTimestamp > prevTimestamp) {
          const ratio = (currentTime - prevTimestamp) / (nextTimestamp - prevTimestamp);
          const lat = prevCoord[0] + (nextCoord[0] - prevCoord[0]) * ratio;
          const lng = prevCoord[1] + (nextCoord[1] - prevCoord[1]) * ratio;
          pos = [lat, lng];
        } else {
          pos = prevCoord as LatLngExpression;
        }
        break;
      }
    }
    
    // --- DEBUG LOGGING ---
    if (pos) {
      console.log(`[Marker] Calculated new position: [${pos[0]}, ${pos[1]}]`);
    } else {
      console.log('[Marker] Position is outside the current track segment.');
    }
    
    setPosition(pos);
  }, [activities, currentTime]);

  if (!position) {
    return null;
  }

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default CurrentPositionMarker;

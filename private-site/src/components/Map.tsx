import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents } from 'react-leaflet';
import { Activity } from '../types/activity';
import Legend from './Legend';
import { LatLngBoundsExpression, Icon } from 'leaflet';
import useSimplifiedActivities from '../hooks/useSimplifiedActivities';
import CurrentPositionMarker from './CurrentPositionMarker';

// --- THE FOOLPROOF ICON FIX ---
// By importing the images and overriding the default options, we ensure
// the bundler uses the correct assets and Leaflet doesn't try to fetch them.
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
// --- END OF FIX ---

interface MapProps {
  activities: Activity[];
  timeRange: [number, number];
  currentTime: number;
  bounds: LatLngBoundsExpression;
}

const activityColor: { [key: string]: string } = {
  Run: 'red',
  Hike: 'green',
  Cycle: 'blue',
  Walking: 'purple',
  Rucking: 'brown',
};

const getActivityColor = (type: string) => {
  return activityColor[type] || 'black'; // Default to black for unknown types
};

const MapEvents = ({ onZoomEnd }: { onZoomEnd: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomEnd(map.getZoom());
    },
  });
  return null;
};

const Map = ({ activities, timeRange, currentTime, bounds }: MapProps) => {
  const [zoom, setZoom] = useState(13);
  const simplifiedActivities = useSimplifiedActivities(activities, zoom);

  const filteredActivities = simplifiedActivities.map(activity => {
    const filteredIndices: number[] = [];
    const filteredCoords = activity.coordinates.filter((_, index) => {
      const timestamp = activity.timestamps[index];
      const inRange = timestamp >= timeRange[0] && timestamp <= timeRange[1];
      if (inRange) {
        filteredIndices.push(index);
      }
      return inRange;
    });

    if (filteredIndices.length > 0) {
        const firstVisibleIndex = filteredIndices[0];
        if (firstVisibleIndex > 0) {
            filteredCoords.unshift(activity.coordinates[firstVisibleIndex - 1]);
        }
        const lastVisibleIndex = filteredIndices[filteredIndices.length - 1];
        if (lastVisibleIndex < activity.coordinates.length - 1) {
            filteredCoords.push(activity.coordinates[lastVisibleIndex + 1]);
        }
    }
    
    return { ...activity, coordinates: filteredCoords };
  });

  return (
    <MapContainer bounds={bounds} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onZoomEnd={setZoom} />
      <Legend />
      {filteredActivities.map((activity, index) => (
        <Polyline
          key={index}
          positions={activity.coordinates}
          color={getActivityColor(activity.type)}
        />
      ))}
      <CurrentPositionMarker activities={simplifiedActivities} currentTime={currentTime} />
    </MapContainer>
  );
};

export default Map;

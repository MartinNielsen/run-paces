import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Activity } from '../types/activity';
import Legend from './Legend';
import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import useSimplifiedActivities from '../hooks/useSimplifiedActivities';

interface MapProps {
  activities: Activity[];
  timeRange: [number, number];
  currentTime: number;
  minTime: number;
  maxTime: number;
  bounds: LatLngBoundsExpression;
}

const activityColor = {
  Run: 'red',
  Hike: 'green',
  Cycle: 'blue',
};

const MapEvents = ({ onZoomEnd }: { onZoomEnd: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomEnd(map.getZoom());
    },
  });
  return null;
};

const Map = ({ activities, timeRange, currentTime, minTime, maxTime, bounds }: MapProps) => {
  const [zoom, setZoom] = useState(13);
  const simplifiedActivities = useSimplifiedActivities(activities, zoom);

  const filteredActivities = simplifiedActivities.map(activity => {
    const filteredPoints = activity.coordinates.filter((_, index) => {
      const timestamp = activity.timestamps[index];
      return timestamp >= timeRange[0] && timestamp <= timeRange[1];
    });
    return { ...activity, coordinates: filteredPoints };
  });

  let currentPosition: LatLngExpression | null = null;
  for (const activity of activities) {
    const index = activity.timestamps.findIndex(t => t >= currentTime);
    if (index !== -1) {
      const nextIndex = index;
      const prevIndex = index > 0 ? index - 1 : 0;

      const prevTimestamp = activity.timestamps[prevIndex];
      const nextTimestamp = activity.timestamps[nextIndex];
      const prevCoord = activity.coordinates[prevIndex];
      const nextCoord = activity.coordinates[nextIndex];

      if (nextTimestamp > prevTimestamp) {
        const ratio = (currentTime - prevTimestamp) / (nextTimestamp - prevTimestamp);
        const lat = prevCoord[0] + (nextCoord[0] - prevCoord[0]) * ratio;
        const lng = prevCoord[1] + (nextCoord[1] - prevCoord[1]) * ratio;
        currentPosition = [lat, lng];
      } else {
        currentPosition = activity.coordinates[index] as LatLngExpression;
      }
      break;
    }
  }


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
          color={activityColor[activity.type]}
        />
      ))}
      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>
            Current Position
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;

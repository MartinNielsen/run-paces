import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents } from 'react-leaflet';
import { Activity } from '../types/activity';
import Legend from './Legend';
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import useSimplifiedActivities from '../hooks/useSimplifiedActivities';
import CurrentPositionMarker from './CurrentPositionMarker';
import MapUpdater from './MapUpdater';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  activities: Activity[];
  timeRange: [number, number];
  bounds: LatLngBoundsExpression;
  viewBounds: LatLngBoundsExpression;
  currentPosition: LatLngExpression | null;
}

const activityColor: { [key: string]: string } = {
  Run: 'red',
  Hike: 'green',
  Cycle: 'blue',
  Walking: 'purple',
  Rucking: 'brown',
};

const getActivityColor = (type: string) => {
  return activityColor[type] || 'black';
};

const MapEvents = ({ onZoomEnd }: { onZoomEnd: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomEnd(map.getZoom());
    },
  });
  return null;
};

const Map = ({ activities, timeRange, bounds, viewBounds, currentPosition }: MapProps) => {
  const [zoom, setZoom] = useState(13);
  const simplifiedActivities = useSimplifiedActivities(activities, zoom);

  const filteredActivities = simplifiedActivities.map(activity => {
    const filteredCoords = activity.coordinates.filter((_, index) => {
      const timestamp = activity.timestamps[index];
      return timestamp >= timeRange[0] && timestamp <= timeRange[1];
    });
    return { ...activity, coordinates: filteredCoords };
  });

  return (
    <MapContainer bounds={bounds} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onZoomEnd={setZoom} />
      <MapUpdater bounds={viewBounds} />
      <Legend />
      {filteredActivities.map((activity, index) => (
        <Polyline
          key={index}
          positions={activity.coordinates}
          color={getActivityColor(activity.type)}
        />
      ))}
      <CurrentPositionMarker position={currentPosition} />
    </MapContainer>
  );
};

export default Map;

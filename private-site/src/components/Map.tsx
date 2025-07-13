import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Activity } from '../types/activity';
import Legend from './Legend';
import { LatLngExpression, LatLngBoundsExpression, Icon } from 'leaflet';
import useSimplifiedActivities from '../hooks/useSimplifiedActivities';

// Fix for default marker icon issue with bundlers
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});


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

const CurrentPositionMarker = ({ activities, currentTime }: { activities: Activity[], currentTime: number }) => {
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
    <Marker position={position} icon={DefaultIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
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

    // To draw continuous lines, we need to include the last point before the range
    // and the first point after the range.
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

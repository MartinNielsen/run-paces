import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';

interface MapUpdaterProps {
  bounds: LatLngBoundsExpression;
}

const MapUpdater = ({ bounds }: MapUpdaterProps) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
};

export default MapUpdater;

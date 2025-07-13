import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';

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
  position: LatLngExpression | null;
}

const CurrentPositionMarker = ({ position }: CurrentPositionMarkerProps) => {
  if (!position) {
    return null;
  }

  // This log will now only show when the parent decides to render it with a new position.
  if (Array.isArray(position)) {
    console.log(`[Marker] Rendering at new position: [${position[0]}, ${position[1]}]`);
  }

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>Current Position</Popup>
    </Marker>
  );
};

export default CurrentPositionMarker;

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ActivityPolylines from './components/ActivityPolylines';
import Legend from './components/Legend';

function App() {
  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ActivityPolylines />
      </MapContainer>
      <Legend />
    </div>
  );
}

export default App;
import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import Map from './components/Map';
import Controls from './components/Controls';
import { garminActivities } from './data/garminData';
import './App.css';
import { LatLngBoundsExpression } from 'leaflet';

function App() {
  const { minTime, maxTime, bounds } = useMemo(() => {
    const allTimestamps = garminActivities.flatMap(a => a.timestamps);
    const allCoords = garminActivities.flatMap(a => a.coordinates);
    const minLat = Math.min(...allCoords.map(c => c[0]));
    const maxLat = Math.max(...allCoords.map(c => c[0]));
    const minLng = Math.min(...allCoords.map(c => c[1]));
    const maxLng = Math.max(...allCoords.map(c => c[1]));

    return {
      minTime: Math.min(...allTimestamps),
      maxTime: Math.max(...allTimestamps),
      bounds: [[minLat, minLng], [maxLat, maxLng]] as LatLngBoundsExpression,
    };
  }, []);

  const [timeRange, setTimeRange] = useState<[number, number]>([minTime, maxTime]);
  const [currentTime, setCurrentTime] = useState<number>(minTime);

  return (
    <div className="App">
      <Map
        activities={garminActivities}
        timeRange={timeRange}
        currentTime={currentTime}
        bounds={bounds}
      />
      <Controls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        minTime={minTime}
        maxTime={maxTime}
      />
    </div>
  );
}

export default App;

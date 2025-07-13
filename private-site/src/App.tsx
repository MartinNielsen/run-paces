import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import Map from './components/Map';
import Controls from './components/Controls';
import { mockActivities } from './data/mockData';
import './App.css';
import { LatLngBoundsExpression } from 'leaflet';

function App() {
  const { minTime, maxTime, bounds } = useMemo(() => {
    const allTimestamps = mockActivities.flatMap(a => a.timestamps);
    const allCoords = mockActivities.flatMap(a => a.coordinates);
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
        activities={mockActivities}
        timeRange={timeRange}
        currentTime={currentTime}
        minTime={minTime}
        maxTime={maxTime}
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

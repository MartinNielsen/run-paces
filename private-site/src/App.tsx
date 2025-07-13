import { useState, useMemo, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import Map from './components/Map';
import Controls from './components/Controls';
import { garminActivities } from './data/garminData';
import './App.css';
import { LatLngBoundsExpression } from 'leaflet';
import { useShake } from './hooks/useShake';
import { Fab, Tooltip } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import DeleteIcon from '@mui/icons-material/Delete';

// Define the type for the DeviceMotionEvent with the requestPermission method
interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

function App() {
  const [sensorPermission, setSensorPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const handleLogout = useCallback(() => {
    // Clear localStorage and reload the page
    localStorage.clear();
    window.location.reload();
  }, []);

  useShake(handleLogout, 30);

  const requestSensorPermission = async () => {
    const requestPermission = (DeviceMotionEvent as unknown as DeviceMotionEventWithPermission).requestPermission;
    if (typeof requestPermission === 'function') {
      try {
        const permissionState = await requestPermission();
        if (permissionState === 'granted') {
          setSensorPermission('granted');
        } else {
          setSensorPermission('denied');
        }
      } catch (error) {
        console.error('Sensor permission request failed', error);
        setSensorPermission('denied');
      }
    } else {
      // If the API doesn't exist, we assume permission is granted (for non-iOS 13+ browsers)
      setSensorPermission('granted');
    }
  };

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
      {sensorPermission === 'prompt' && (
        <Tooltip title="Enable Shake-to-Reset">
          <Fab
            color="primary"
            aria-label="enable shake to reset"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1000,
            }}
            onClick={requestSensorPermission}
          >
            <ScreenRotationIcon />
          </Fab>
        </Tooltip>
      )}
      <Tooltip title="Logout and clear data">
        <Fab
          color="secondary"
          aria-label="logout"
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={handleLogout}
        >
          <DeleteIcon />
        </Fab>
      </Tooltip>
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

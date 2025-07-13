import { useState, useMemo, useCallback, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Map from './components/Map';
import Controls from './components/Controls';
import { garminActivities } from './data/garminData';
import './App.css';
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { useShake } from './hooks/useShake';
import { Fab, Tooltip } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

function App() {
  const [sensorPermission, setSensorPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const handleLogout = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const { isCalibrating } = useShake(handleLogout, 3);

  const requestSensorPermission = async () => {
    const requestPermission = (DeviceMotionEvent as unknown as DeviceMotionEventWithPermission).requestPermission;
    if (typeof requestPermission === 'function') {
      try {
        const permissionState = await requestPermission();
        setSensorPermission(permissionState === 'granted' ? 'granted' : 'denied');
      } catch (error) {
        console.error('Sensor permission request failed', error);
        setSensorPermission('denied');
      }
    } else {
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
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);
  const [viewBounds, setViewBounds] = useState<LatLngBoundsExpression>(bounds);

  useEffect(() => {
    let pos: LatLngExpression | null = null;
    for (const activity of garminActivities) {
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

        if (nextTimestamp > prevTimestamp) {
          const ratio = (currentTime - prevTimestamp) / (nextTimestamp - prevTimestamp);
          const lat = prevCoord[0] + (nextCoord[0] - prevCoord[0]) * ratio;
          const lng = prevCoord[1] + (nextCoord[1] - prevCoord[1]) * ratio;
          pos = [lat, lng];
        } else {
          pos = prevCoord as LatLngExpression;
        }
        break;
      }
    }
    setCurrentPosition(pos);
  }, [currentTime]);

  const handleCurrentTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
  };
  
  const handleTimeRangeChange = (newRange: [number, number]) => {
    setTimeRange(newRange);
    if (currentTime < newRange[0] || currentTime > newRange[1]) {
      setCurrentTime(newRange[0]);
    }
  };

  const handleTimeRangeChangeCommitted = () => {
    const coordsInRange = garminActivities
      .flatMap(a => a.coordinates.filter((_, index) => {
        const timestamp = a.timestamps[index];
        return timestamp >= timeRange[0] && timestamp <= timeRange[1];
      }));

    if (coordsInRange.length > 0) {
      const minLat = Math.min(...coordsInRange.map(c => c[0]));
      const maxLat = Math.max(...coordsInRange.map(c => c[0]));
      const minLng = Math.min(...coordsInRange.map(c => c[1]));
      const maxLng = Math.max(...coordsInRange.map(c => c[1]));
      setViewBounds([[minLat, minLng], [maxLat, maxLng]]);
    } else {
      setViewBounds(bounds); // Reset to overall bounds if no points are in range
    }
  };

  return (
    <div className="App">
      {isCalibrating && (
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 1001, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '8px 12px', borderRadius: '8px' }}>
          Shake to reset sensors calibrating...
        </div>
      )}
      {sensorPermission === 'prompt' && (
        <Tooltip title="Enable Shake-to-Reset">
          <Fab color="primary" aria-label="enable shake to reset" style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }} onClick={requestSensorPermission}>
            <ScreenRotationIcon />
          </Fab>
        </Tooltip>
      )}
      <Tooltip title="Logout and clear data">
        <Fab color="secondary" aria-label="logout" style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }} onClick={handleLogout}>
          <DeleteIcon />
        </Fab>
      </Tooltip>
      <Map
        activities={garminActivities}
        timeRange={timeRange}
        bounds={bounds}
        viewBounds={viewBounds}
        currentPosition={currentPosition}
      />
      <Controls
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onTimeRangeChangeCommitted={handleTimeRangeChangeCommitted}
        currentTime={currentTime}
        onCurrentTimeChange={handleCurrentTimeChange}
        minTime={minTime}
        maxTime={maxTime}
      />
    </div>
  );
}

export default App;

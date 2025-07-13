import { Slider, Box, Typography } from '@mui/material';

interface ControlsProps {
  timeRange: [number, number];
  onTimeRangeChange: (value: [number, number]) => void;
  onTimeRangeChangeCommitted: () => void;
  currentTime: number;
  onCurrentTimeChange: (value: number) => void;
  minTime: number;
  maxTime: number;
}

const Controls = ({
  timeRange,
  onTimeRangeChange,
  onTimeRangeChangeCommitted,
  currentTime,
  onCurrentTimeChange,
  minTime,
  maxTime,
}: ControlsProps) => {
  const handleTimeRangeChange = (_event: Event, newValue: number | number[]) => {
    onTimeRangeChange(newValue as [number, number]);
  };

  const handleCurrentTimeChange = (_event: Event, newValue: number | number[]) => {
    onCurrentTimeChange(newValue as number);
  };

  return (
    <Box className="controls-container" sx={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      p: 2,
      pt: 3, // Add more padding to the top
      borderRadius: 1,
      boxShadow: 3,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Center the items vertically
      boxSizing: 'border-box', // Ensure padding is included in the height
    }}>
      <Box>
        <Typography id="range-slider" gutterBottom>
          Time Range
        </Typography>
        <Slider
          value={timeRange}
          onChange={handleTimeRangeChange}
          onChangeCommitted={onTimeRangeChangeCommitted}
          valueLabelDisplay="auto"
          min={minTime}
          max={maxTime}
          valueLabelFormat={(value) => new Date(value).toLocaleString()}
        />
      </Box>
      <Box>
        <Typography id="current-time-slider" gutterBottom>
          Current Time
        </Typography>
        <Slider
          value={currentTime}
          onChange={handleCurrentTimeChange}
          valueLabelDisplay="auto"
          min={timeRange[0]}
          max={timeRange[1]}
          valueLabelFormat={(value) => new Date(value).toLocaleString()}
        />
      </Box>
    </Box>
  );
};

export default Controls;

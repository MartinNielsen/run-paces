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
      bottom: '15px', // Use a safe, fixed pixel value
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%', // Make wider for better slider control
      py: 1,        // Minimal vertical padding
      px: 2,        // Horizontal padding
      borderRadius: 2,
      boxShadow: 3,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
        Time Range
      </Typography>
      <Slider
        size="small"
        value={timeRange}
        onChange={handleTimeRangeChange}
        onChangeCommitted={onTimeRangeChangeCommitted}
        valueLabelDisplay="auto"
        min={minTime}
        max={maxTime}
        valueLabelFormat={(value) => new Date(value).toLocaleString()}
        sx={{ mt: -1 }} // Aggressive negative margin to pull slider up
      />
      <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'left', mt: 1 }}>
        Current Time
      </Typography>
      <Slider
        size="small"
        value={currentTime}
        onChange={handleCurrentTimeChange}
        valueLabelDisplay="auto"
        min={timeRange[0]}
        max={timeRange[1]}
        valueLabelFormat={(value) => new Date(value).toLocaleString()}
        sx={{ mt: -1 }} // Aggressive negative margin
      />
    </Box>
  );
};

export default Controls;

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
      bottom: '25px', // Fine-tuned bottom margin
      left: '50%',
      transform: 'translateX(-50%)',
      width: '85%', // Slightly wider
      p: 1,
      py: 1.5, // Adjust vertical padding
      borderRadius: 2, // Slightly more rounded corners
      boxShadow: 3,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Re-center vertically
      boxSizing: 'border-box',
    }}>
      <Box sx={{ px: 1 }}> {/* Add horizontal padding to the inner boxes */}
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}> {/* Smaller, bold text */}
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
          sx={{ p: 0, mt: -0.5 }} // Remove padding, add small negative margin
        />
      </Box>
      <Box sx={{ px: 1, mt: 0.5 }}> {/* Add horizontal padding and small top margin */}
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}> {/* Smaller, bold text */}
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
          sx={{ p: 0, mt: -0.5 }} // Remove padding, add small negative margin
        />
      </Box>
    </Box>
  );
};

export default Controls;

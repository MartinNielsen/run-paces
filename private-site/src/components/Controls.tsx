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
      bottom: '2vh', // Position using viewport height
      left: '50%',
      transform: 'translateX(-50%)',
      width: '85%',
      p: 1.5, // Apply some padding
      borderRadius: 2,
      boxShadow: 3,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
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
        sx={{ mt: -0.5, mb: 1 }} // Negative top margin, positive bottom margin
      />
      <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
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
        sx={{ mt: -0.5 }} // Negative top margin
      />
    </Box>
  );
};

export default Controls;

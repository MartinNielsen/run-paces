import { Slider, Box, Typography } from '@mui/material';

interface ControlsProps {
  timeRange: [number, number];
  setTimeRange: (value: [number, number]) => void;
  currentTime: number;
  setCurrentTime: (value: number) => void;
  minTime: number;
  maxTime: number;
}

const Controls = ({
  timeRange,
  setTimeRange,
  currentTime,
  setCurrentTime,
  minTime,
  maxTime,
}: ControlsProps) => {
  const handleTimeRangeChange = (event: Event, newValue: number | number[]) => {
    setTimeRange(newValue as [number, number]);
  };

  const handleCurrentTimeChange = (event: Event, newValue: number | number[]) => {
    setCurrentTime(newValue as number);
  };

  return (
    <Box sx={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      bgcolor: 'background.paper',
      p: 2,
      borderRadius: 1,
      boxShadow: 3,
      zIndex: 1000
    }}>
      <Typography id="range-slider" gutterBottom>
        Time Range
      </Typography>
      <Slider
        value={timeRange}
        onChange={handleTimeRangeChange}
        valueLabelDisplay="auto"
        min={minTime}
        max={maxTime}
        valueLabelFormat={(value) => new Date(value).toLocaleString()}
      />
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
  );
};

export default Controls;

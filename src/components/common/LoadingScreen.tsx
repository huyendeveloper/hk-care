import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        placeContent: 'center',
        gridRowStart: 2,
        height: 1,
      }}
    >
      <Box>
        <Typography gutterBottom variant="subtitle2" align="center">
          Product name
        </Typography>
        <Box sx={{ width: 400 }}>
          <LinearProgress />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingScreen;

import GlobalStyles from '@mui/material/GlobalStyles';
import { memo } from 'react';

const GlobalBaseStyles = () => {
  return (
    <GlobalStyles
      styles={{
        'html, body, #root': {
          height: '100%',
          width: '100%',
        },
        '#root': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
        },
        '#nprogress': {
          pointerEvents: 'none',
        },
        '#nprogress .bar': {
          backgroundColor: '#00AB55',
          height: 3,
          left: 0,
          top: 0,
          position: 'fixed',
          width: '100%',
          zIndex: 1998,
        },
      }}
    />
  );
};

export default memo(GlobalBaseStyles);

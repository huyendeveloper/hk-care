import type { ThemeOptions } from '@mui/material';

// Transpora palette
const transpora = {
  100: '#FEFBD3',
  200: '#FEF7A8',
  300: '#FEF27D',
  400: '#FDEC5D',
  500: '#FDE428',
  600: '#D9C11D',
  700: '#B69F14',
  800: '#927E0C',
  900: '#796607',
};

const palette: ThemeOptions = {
  // typography: {
  //   fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
  // },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#6B7280',
          color: '#FFFFFF',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E6E8F0',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    transpora,
    background: {
      default: '#f4f5f7',
      paper: '#FFFFFF',
    },
    primary: {
      light: '#5BE584',
      main: '#00AB55',
      dark: '#007B55',
    },
  },
};

export default palette;

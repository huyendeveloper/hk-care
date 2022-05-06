import type { Theme } from '@mui/material';
import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import merge from 'lodash.merge';
import base from './base';
import palette from './palette';

// https://colors.eva.design/
interface Transpora {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    transpora: Transpora;
  }

  interface PaletteOptions {
    transpora: Transpora;
  }
}

export const createTheme = (): Theme => {
  const theme = createMuiTheme(merge(base, palette));

  return responsiveFontSizes(theme);
};

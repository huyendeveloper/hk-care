import Paper from '@mui/material/Paper';
import type { FormHTMLAttributes, ReactNode } from 'react';

type Props =
  | {
      children: [ReactNode, ReactNode, ReactNode];
      disableHeader?: never;
      height?: string;
      gridTemplateRows?: string;
    }
  | {
      children: [ReactNode, ReactNode];
      disableHeader: true;
      gridTemplateRows?: string;
      height?: string;
    };

const FormPaperGrid = (props: Props & FormHTMLAttributes<HTMLFormElement>) => {
  const {
    children,
    disableHeader,
    height = '100%',
    gridTemplateRows = 'auto 1fr auto',
    ...rest
  } = props;
  return (
    <Paper
      component="form"
      sx={{
        display: 'grid',
        gridTemplateRows,
        rowGap: 1,
        p: 2.5,
        height,
        ...(disableHeader && {
          gridTemplateRows: '1fr auto',
        }),
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default FormPaperGrid;

import Box from '@mui/material/Box';
import type { FormHTMLAttributes, ReactNode } from 'react';

type Props =
  | { children: [ReactNode, ReactNode, ReactNode]; disableHeader?: never }
  | { children: [ReactNode, ReactNode]; disableHeader: true };

const FormGrid = (props: Props & FormHTMLAttributes<HTMLFormElement>) => {
  const { children, disableHeader, ...rest } = props;
  return (
    <Box
      component="form"
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        rowGap: 1,
        p: 2.5,
        height: 1,
        ...(disableHeader && {
          gridTemplateRows: '1fr auto',
        }),
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default FormGrid;

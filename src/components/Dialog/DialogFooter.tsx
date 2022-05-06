import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import type { FC } from 'react';

const DialogFooter: FC<BoxProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <Box {...rest}>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, py: 2.5 }}>
        <Stack direction="row" spacing={1}>
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default DialogFooter;

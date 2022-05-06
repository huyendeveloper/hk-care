import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';

interface Props extends Omit<BoxProps, 'loading'> {
  loading?: boolean;
}

const DialogContent = (props: Props) => {
  const { children, ...rest } = props;
  return (
    <Box sx={{ p: 3, position: 'relative' }} {...rest}>
      {children}
    </Box>
  );
};

export default DialogContent;

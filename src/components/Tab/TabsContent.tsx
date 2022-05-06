import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const TabsContent = (props: BoxProps) => {
  const { children, ...rest } = props;
  return (
    <Box {...rest}>
      <Divider />
      {children}
    </Box>
  );
};

export default TabsContent;

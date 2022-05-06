import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';

const FormContent = (props: BoxProps) => {
  const { children, ...rest } = props;
  return <Box {...rest}>{children}</Box>;
};

export default FormContent;

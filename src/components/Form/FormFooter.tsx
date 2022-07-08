import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';

interface IProps {
  hidden?: boolean;
  children?: ReactNode;
}

const FormFooter = (props: IProps) => {
  const { children, hidden } = props;
  return hidden ? (
    <></>
  ) : (
    <Box sx={{ mt: 2 }}>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Stack direction="row" spacing={1}>
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default FormFooter;

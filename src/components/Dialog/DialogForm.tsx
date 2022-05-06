import Box from '@mui/material/Box';
import type { FormHTMLAttributes } from 'react';

const DialogForm = (props: FormHTMLAttributes<HTMLFormElement>) => {
  return <Box component="form" {...props} />;
};

export default DialogForm;

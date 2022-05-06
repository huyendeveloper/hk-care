import Paper from '@mui/material/Paper';
import type { FC } from 'react';

const PaperTable: FC = (props) => {
  const { children } = props;
  return (
    <Paper sx={{ display: 'grid', gridTemplateRows: 'auto 1fr' }} {...props}>
      {children}
    </Paper>
  );
};

export default PaperTable;

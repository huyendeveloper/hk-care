import { TableCell } from '@mui/material';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';

interface Props extends BoxProps {
  loading: boolean;
  total: number;
  noDataText?: string;
  colSpan: number;
}

const TableBodyContent: FC<Props> = (props) => {
  const { loading, total, children, colSpan, noDataText, ...rest } = props;

  if (loading) return <></>;

  if (total === 0) {
    return (
      <TableCell colSpan={colSpan}>
        <Box
          sx={{ display: 'grid', placeContent: 'center', minHeight: '40vh' }}
        >
          <Typography variant="h6" color="text.secondary">
            {'Không tìm thấy thông tin tìm kiếm'}
          </Typography>
        </Box>
      </TableCell>
    );
  }

  return <>{children}</>;
};

export default TableBodyContent;

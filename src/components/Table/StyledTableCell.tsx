import { styled } from '@mui/material/styles';
import type { TableCellProps } from '@mui/material/TableCell';
import TableCell from '@mui/material/TableCell';

interface Props extends TableCellProps {
  nowrap?: boolean;
}

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => !['nowrap'].includes(prop),
})<Props>(({ nowrap }) => ({
  maxWidth: 400,
  ...(nowrap && {
    'white-space': 'nowrap',
  }),
}));

export default StyledTableCell;

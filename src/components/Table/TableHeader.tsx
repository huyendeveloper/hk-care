import type { TableCellProps } from '@mui/material/TableCell';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { Dictionary, Order } from 'types/common';

export interface Cell<T> {
  id: keyof T;
  label: string | React.ReactElement;
  align?: TableCellProps['align'];
}

export type Cells<T> = Cell<T>[];

interface Props<T> {
  cells: Cells<T>;
  onSort: (field: keyof T) => void;
  sortDirection: Order;
  sortBy: string;
}

const TableHeader = <T extends Dictionary>(props: Props<T>) => {
  const { cells } = props;

  return (
    <TableHead>
      <TableRow>
        {cells.map((cell, i) => {
          const { label, align } = cell;
          return (
            <TableCell
              key={i}
              align={align}
              sx={label ? {} : { padding: '0px' }}
            >
              <div style={{ fontSize: '1.125rem' }}>{label}</div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;

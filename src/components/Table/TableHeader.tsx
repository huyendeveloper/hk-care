import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import type { TableCellProps } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import type { MouseEventCurrying } from 'types';
import type { Dictionary, Order } from 'types/common';

export interface Cell<T> {
  id: keyof T;
  label: string;
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
  const { cells, onSort, sortDirection, sortBy } = props;

  const handleOnSort: MouseEventCurrying<HTMLSpanElement, keyof T> =
    (field) => () => {
      onSort(field);
    };

  return (
    <TableHead>
      <TableRow>
        {cells.map((cell, i) => {
          const { id, label, align } = cell;
          return (
            <TableCell key={i} align={align}>
              <TableSortLabel
                active={sortBy === id}
                direction={
                  sortBy === id && sortDirection ? sortDirection : undefined
                }
                onClick={handleOnSort(id)}
              >
                {label}
                {sortBy === id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {sortDirection === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;

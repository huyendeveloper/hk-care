import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, TableCell, TableRow } from '@mui/material';
import { IRequestImport } from 'interface';
import { useState } from 'react';
import { FilterParams } from 'types';
import formatDateTime from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';

interface IProps {
  groupName: string;
  list: any[];
  filters: FilterParams;
  index: number;
}

const ExpandRow = ({ groupName, list, filters, index }: IProps) => {
  const [expand, setExpand] = useState<boolean>(true);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        key={groupName}
        onClick={() => setExpand(!expand)}
      >
        <TableCell>
          <span style={{ marginRight: '20px', width: 'min-content' }}>
            {index}
          </span>
          {groupName}:
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
          {`${numberFormat(
            list.reduce((pre, cur) => pre + cur.quantity, 0)
          )} (${list[0].measureName})`}
        </TableCell>
        <TableCell
          sx={{
            padding: '17px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              transform: expand ? 'rotate(0)' : 'rotate(180deg)',
              display: 'flex',
            }}
          >
            <KeyboardArrowDownIcon />
          </Box>
        </TableCell>
      </TableRow>
      {/* @ts-ignore */}
      {expand &&
        list.map((item: IRequestImport) => {
          const { id, tenant, quantity, requestDate } = item;
          return (
            <TableRow hover tabIndex={-1} key={id}>
              <TableCell></TableCell>
              <TableCell>{tenant}</TableCell>
              <TableCell>{numberFormat(quantity || 0)}</TableCell>{' '}
              <TableCell>{formatDateTime(requestDate)}</TableCell>
            </TableRow>
          );
        })}
    </>
  );
};

export default ExpandRow;

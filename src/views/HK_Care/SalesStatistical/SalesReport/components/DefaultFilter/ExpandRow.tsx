import { TableCell, TableRow } from '@mui/material';
import { ISalesReport } from 'interface';
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
        <TableCell colSpan={5} sx={{ padding: '16px' }}>
          {groupName}
        </TableCell>
        <TableCell
          colSpan={1}
          sx={{
            textAlign: 'center',
          }}
        >
          {numberFormat(list.reduce((pre, cur) => pre + cur.orderValue, 0))}
        </TableCell>
      </TableRow>
      {/* @ts-ignore */}
      {expand &&
        list.map((item: ISalesReport, index) => {
          // @ts-ignore
          const { id, code, employeeName, saleDate, orderValue, rowId } = item;
          return (
            <TableRow hover tabIndex={-1} key={index}>
              <TableCell>
                {/* {(filters.pageIndex - 1) * filters.pageSize + index + 1} */}
                {rowId}
              </TableCell>
              <TableCell>{code}</TableCell>
              <TableCell>{employeeName}</TableCell>
              <TableCell>{formatDateTime(saleDate)}</TableCell>
              <TableCell>{numberFormat(orderValue)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          );
        })}
    </>
  );
};

export default ExpandRow;

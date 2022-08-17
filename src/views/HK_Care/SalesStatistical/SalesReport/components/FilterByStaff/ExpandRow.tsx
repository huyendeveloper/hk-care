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
}

const ExpandRow = ({ groupName, list, filters }: IProps) => {
  const [expand, setExpand] = useState<boolean>(true);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        key={groupName}
        onClick={() => setExpand(!expand)}
      >
        <TableCell colSpan={4} sx={{ padding: '16px' }}>
          {groupName}
        </TableCell>
        <TableCell colSpan={1} sx={{ width: '100px !important' }}>
          {numberFormat(list.reduce((pre, cur) => pre + cur.orderValue, 0))}
        </TableCell>
      </TableRow>
      {/* @ts-ignore */}
      {expand &&
        list.map((item: ISalesReport, index) => {
          // @ts-ignore
          const { id, code, saleDate, orderValue, rowId } = item;
          return (
            <TableRow hover tabIndex={-1} key={id}>
              <TableCell>
                {/* {(filters.pageIndex - 1) * filters.pageSize + index + 1} */}
                {rowId}
              </TableCell>
              <TableCell>{code}</TableCell>
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

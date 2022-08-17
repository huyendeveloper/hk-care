import { Stack, TableBody, TableCell, TableRow } from '@mui/material';
import type { Cells } from 'components/Table/TableHeader';
import TableHeader from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IImportReceipt, IRevenueReport } from 'interface';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import type { FilterParams } from 'types/common';
import { numberFormat } from 'utils/numberFormat';
import ExpandRow from './ExpandRow';

const getCells = (): Cells<IImportReceipt> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'id',
    label: 'Mã hóa đơn',
  },
  {
    id: 'id',
    label: 'Nhân viên bán hàng',
  },
  {
    id: 'creationTime',
    label: 'Ngày bán',
  },
  {
    id: 'moneyToPay',
    label: 'Giá trị hóa đơn',
  },
  {
    id: 'debts',
    label: 'Doanh thu',
  },
];

interface IProps {
  revenueReport: IRevenueReport[];
  filters: FilterParams;
  totalRevenue: number;
}

const DefaultFilter = ({ revenueReport, filters, totalRevenue }: IProps) => {
  const cells = useMemo(() => getCells(), []);

  const revenueReportList = useMemo(() => {
    let rowId = 1 + (filters.pageIndex - 1) * filters.pageSize;

    const formatedList = revenueReport.map((item: IRevenueReport) => ({
      ...item,
      saleDateFormated: moment(item.saleDate).format('DD/MM/YYYY'),
    }));

    const revenueReportObj = [...(formatedList as IRevenueReport[])].reduce(
      (group, product) => {
        // @ts-ignore
        const { saleDateFormated } = product;
        // @ts-ignore
        group[saleDateFormated] = group[saleDateFormated] ?? [];
        // @ts-ignore
        group[saleDateFormated].push({ ...product, rowId });
        rowId = rowId + 1;
        return group;
      },
      {}
    );
    return revenueReportObj;
  }, [filters.pageIndex, filters.pageSize, revenueReport]);

  const handleOnSort = (field: string) => {};

  return (
    <>
      <TableHeader
        cells={cells}
        onSort={handleOnSort}
        sortDirection={filters.sortDirection}
        sortBy={filters.sortBy}
      />

      <TableBody>
        {Object.keys(revenueReportList).map((key, index) => {
          return (
            <ExpandRow
              key={key}
              groupName={key} // @ts-ignore
              list={revenueReportList[key]}
              filters={filters}
              index={index + 1}
            />
          );
        })}
      </TableBody>
      <tr>
        <td colSpan={4}></td>
        <td colSpan={2} style={{ paddingTop: '40px' }}>
          <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
            <div>Tổng doanh thu:</div>
            <div>{numberFormat(totalRevenue)}</div>
          </Stack>
        </td>
      </tr>
    </>
  );
};

export default DefaultFilter;

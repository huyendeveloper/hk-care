import { Stack, TableBody } from '@mui/material';
import { TableHeader } from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { IRevenueReportStaff } from 'interface';
import moment from 'moment';
import React, { useMemo } from 'react';
import type { FilterParams } from 'types/common';
import { numberFormat } from 'utils/numberFormat';
import ExpandRow from './ExpandRow';

const getCells = (): Cells<IRevenueReportStaff> => [
  {
    id: 'code',
    label: 'STT',
  },
  {
    id: 'code',
    label: 'Mã hóa đơn',
  },
  {
    id: 'code',
    label: 'Ngày bán',
  },
  {
    id: 'code',
    label: 'Giá trị hóa đơn',
  },
  {
    id: 'code',
    label: 'Doanh thu',
  },
];

interface IProps {
  revenueReportStaff: IRevenueReportStaff[];
  filters: FilterParams;
}

const FilterByStaff = ({ revenueReportStaff, filters }: IProps) => {
  const cells = useMemo(() => getCells(), []);

  const revenueReportStaffList = useMemo(() => {
    let rowId = 1 + (filters.pageIndex - 1) * filters.pageSize;

    const formatedList = revenueReportStaff.map(
      (item: IRevenueReportStaff) => ({
        ...item,
        saleDateFormated: moment(item.saleDate).format('DD/MM/YYYY'),
      })
    );

    const revenueReportStaffObj = [
      ...(formatedList as IRevenueReportStaff[]),
    ].reduce((group, product) => {
      // @ts-ignore
      const { saleDateFormated } = product;
      // @ts-ignore
      group[saleDateFormated] = group[saleDateFormated] ?? [];
      // @ts-ignore
      group[saleDateFormated].push({ ...product, rowId });
      rowId = rowId + 1;
      return group;
    }, {});
    return revenueReportStaffObj;
  }, [filters.pageIndex, filters.pageSize, revenueReportStaff]);

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
        {Object.keys(revenueReportStaffList).map((key, index) => {
          return (
            <ExpandRow
              key={key}
              groupName={key} // @ts-ignore
              list={revenueReportStaffList[key]}
              filters={filters}
            />
          );
        })}
      </TableBody>
      {/* <tr>
        <td colSpan={4}></td>
        <td>
          <Stack flexDirection="row" justifyContent="space-between">
            <div>Tổng doanh thu</div>
            <div>
              {numberFormat(
                Object.keys(revenueReportStaffList).reduce((previous, key) => {
                  return (
                    previous +
                    // @ts-ignore
                    salesReport[key].reduce(
                      // @ts-ignore
                      (pre, cur) => pre + cur.orderValue,
                      0
                    )
                  );
                }, 0)
              )}
            </div>
          </Stack>
        </td>
      </tr> */}
    </>
  );
};

export default React.memo(FilterByStaff);

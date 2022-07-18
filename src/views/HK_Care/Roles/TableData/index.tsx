import { Paper, Table, TableBody, TableContainer } from '@mui/material';
import { Scrollbar } from 'components/common';
import { TableContent, TableWrapper } from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IRole } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { FilterParams } from 'types';
import Role from './Role';

const getCells = (): Cells<IRole> => [
  {
    id: 'roleName',
    label: 'Vai trò',
  },
  {
    id: 'qlsp',
    label: 'QLSP',
  },
  {
    id: 'qlkh',
    label: 'QLKH',
  },
  {
    id: 'qlbh',
    label: 'QLBH',
  },
  {
    id: 'qlvh',
    label: 'QLVH',
  },
  {
    id: 'qlvh',
    label: '',
  },
];

const TableData = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false); //true

  const cells = useMemo(() => getCells(), []);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  useEffect(() => {
    setRoles([
      {
        id: 1,
        roleName: 'Quản lý bán hàng',
        qlsp: true,
        qlkh: true,
        qlbh: true,
        qlvh: true,
      },
      {
        id: 2,
        roleName: 'Quản lý sản phẩm',
        qlsp: false,
        qlkh: false,
        qlbh: false,
        qlvh: false,
      },
    ]);
  }, []);

  const handleOpenDeleteDialog = (id: number) => {};

  return (
    <TableWrapper sx={{ height: 1, p: 1.5 }} component={Paper}>
      <TableContent total={roles.length} loading={loading}>
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {roles.map((item, index) => {
                  return (
                    <Role
                      role={item}
                      key={index}
                      index={index + 1}
                      handleOpenDeleteDialog={handleOpenDeleteDialog}
                      addItem={index + 1 === roles.length}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;

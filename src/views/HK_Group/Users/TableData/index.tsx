import AddIcon from '@mui/icons-material/Add';
import { Button, Paper } from '@mui/material';
import { TableSearchField, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IUser } from 'interface';
import { useState } from 'react';
import { FilterParams } from 'types';

const getCells = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'email', label: 'Địa chỉ Email' },
  { id: 'role', label: 'Vai trò' },
  { id: 'tenant', label: 'Điểm bán' },
  { id: 'status', label: 'Trạng thái' },
  { id: 'status', label: 'Thao tác' },
];

const TableData = () => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách người dùng"
        placeHolder="Tìm kiếm người dùng"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm người dùng
        </Button>
      </TableSearchField>
    </TableWrapper>
  );
};

export default TableData;

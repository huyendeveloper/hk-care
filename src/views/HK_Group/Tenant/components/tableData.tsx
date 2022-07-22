import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { Scrollbar } from 'components/common';
import { DeleteDialog } from 'components/Dialog';
import { TableContent, TableHeader, TablePagination, TableSearchField, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { FilterParams } from 'types';
import FormDialog from './formDialog';
import service from '../service';
import { SalePointOutDto } from '../dto/salePointDto';

const getCells = (): Cells<SalePointOutDto> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên điểm bán' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'hotline', label: 'Hotline' },
  { id: 'status', label: 'Trạng thái' },
  { id: 'id', label: 'Thao tác' },
];

const TableData = () => {
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tenantList, setTenantList] = useState<SalePointOutDto[]>([]);
  //const [loading, setLoading] = useState<boolean>(true);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [disableView, setDisableView] = useState<boolean>(false);
  //const [currentID, setCurrentID] = useState<string | null>(null);
  //const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  //const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  //const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const data = async () => await service.search(filters);
    data().then(rel => {
      setLoading(false);
      setTenantList(rel.items);
      setTotalRows(rel.totalCount);
    }).catch(error => {
      setLoading(false);
      setTenantList([]);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [filters]);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const handleChangePage = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
    }));
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const handleDelete = async () => {
    if (!currentID) return;

    const data = await service.delete(currentID);
    handleCloseDeleteDialog();
    if (data.status !== 200) {
      setNotification({ message: data, severity: 'error' });
    }
    else {
      setNotification({ message: data, severity: 'success' });
    }
    setTenantList(tenantList.filter((x) => x.id !== currentID));
  };

  const handleOpenDeleteDialog = (id: string) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenUpdateDialog = (id: string) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenViewDialog = (id: string) => () => {
    setCurrentID(id);
    setDisableView(true);
    setOpenFormDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setDisableView(false);
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const renderAction = (row: SalePointOutDto) => {
    return (
      <>
        <IconButton onClick={handleOpenViewDialog(row.id)}>
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>
        {!row.status && (
          <IconButton onClick={handleOpenDeleteDialog(row.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách điểm bán"
        placeHolder="Tìm kiếm điểm bán"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm điểm bán mới
        </Button>
      </TableSearchField>

      <TableContent total={tenantList.length} loading={loading}>
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
                {tenantList.map((item, index) => {
                  const { id, name, address, hotline, status } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>{hotline}</TableCell>
                      <TableCell>
                        {status ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Dừng Hoạt động</Button>
                        )}
                      </TableCell>
                      <TableCell align="left">{renderAction(item)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          pageIndex={filters.pageIndex}
          totalPages={totalRows}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </TableContent>

      <FormDialog
        currentID={currentID}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
        disable={disableView}
      />

      <DeleteDialog
        id={currentID}
        tableName="điểm bán"
        name={tenantList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
      />
    </TableWrapper>
  );
};

export default TableData;

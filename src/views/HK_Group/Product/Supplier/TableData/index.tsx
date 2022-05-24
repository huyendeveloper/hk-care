import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { LinkIconButton, Scrollbar } from 'components/common';
import { BlockDialog, UnBlockDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { ISupplier } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import supplierService from 'services/supplier.service';
// import supplierService from 'services/supplier.service';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialog from '../FormDialog';

const getCells = (): Cells<ISupplier> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên nhà cung cấp' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'nameContact', label: 'Người liên hệ' },
  { id: 'telephoneNumber', label: 'Số điện thoại' },
  { id: 'active', label: 'Trạng thái' },
  { id: 'active', label: 'Thao tác' },
];

const TableData = () => {
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = () => {
    setLoading(false);
    supplierService
      .getAll(filters)
      .then(({ data }) => {
        setSupplierList(data.items ?? []);
        setTotalRows(Math.ceil(data?.totalCount / filters.pageSize));
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
  };

  const handleOpenBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenBlockDialog(true);
  };

  const handleOpenUnBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenUnBlockDialog(true);
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
  };

  const handleCloseUnBlockDialog = () => {
    setOpenUnBlockDialog(false);
  };

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    setOpenFormDialog(false);
    if (updated) {
      fetchData();
    }
  };

  const handleBlock = async () => {
    if (!currentID) return;
    try {
      await supplierService.changeStatus(currentID, 2);
      handleCloseBlockDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnBlock = async () => {
    if (!currentID) return;
    try {
      await supplierService.changeStatus(currentID, 1);
      handleCloseUnBlockDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const renderAction = (row: ISupplier) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>

        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>

        {row.active === 1 ? (
          <IconButton onClick={handleOpenBlockDialog(row.id)}>
            <BlockIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleOpenUnBlockDialog(row.id)}>
            <CheckIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách nhà cung cấp"
        placeHolder="Tìm kiếm nhà cung cấp"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Thêm mới nhà cung cấp
        </Button>
      </TableSearchField>

      <TableContent total={supplierList.length} loading={loading}>
        <TableContainer sx={{ p: 1.5 }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {supplierList.map((item) => {
                  const {
                    id,
                    name,
                    address,
                    nameContact,
                    telephoneNumber,
                    active,
                  } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>{nameContact}</TableCell>
                      <TableCell>{telephoneNumber}</TableCell>
                      <TableCell>
                        {active === 1 ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Không hoạt động</Button>
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>

      <BlockDialog
        id={currentID}
        tableName="nhà cung cấp"
        name={supplierList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="nhà cung cấp"
        name={supplierList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseUnBlockDialog}
        open={openUnBlockDialog}
        handleUnBlock={handleUnBlock}
      />

      <FormDialog
        currentID={currentID}
        data={supplierList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
      />
    </TableWrapper>
  );
};

export default TableData;

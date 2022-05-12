import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { DeleteDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { useForceUpdate, useMounted } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { getListDangDung } from 'services/crud';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialog from '../FormDialog';
import { DangDung } from '../type';

const getCells = (): Cells<DangDung> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'name',
    label: 'Tên đơn vị đo lường',
  },
  {
    id: 'note',
    label: 'Thao tác',
  },
];

const defaultFilters: FilterParams = {
  pageIndex: 1,
  pageSize: 10,
  sortBy: '',
  sortDirection: '',
  searchText: '',
};

const TableData = () => {
  const mounted = useMounted();
  const [rerender, onForceUpdate] = useForceUpdate();

  const [currentID, setCurrentID] = useState<number | null>(null);
  const [dangDungList, setDangDungList] = useState<DangDung[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  useEffect(() => {
    setLoading(true);
    getListDangDung(filters)
      .then((res) => {
        setDangDungList(res.data ?? []);
        setTotalRows(res.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters, mounted, rerender]);

  const handleOnSort = (field: string) => {
    const { sortBy, sortDirection } = filters;
    const isAsc = sortBy === field && sortDirection === 'asc';
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: isAsc ? 'desc' : 'asc',
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

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const renderAction = (row: DangDung) => {
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

        <IconButton onClick={handleOpenDeleteDialog(row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách đơn vị đo lường"
        placeHolder="Tìm kiếm đơn vị đo lường"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Thêm mới đơn vị đo lường
        </Button>
      </TableSearchField>

      <TableContent total={dangDungList.length} loading={loading}>
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
                {dangDungList.map((item) => {
                  const { id, name } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
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
          totalPages={Math.ceil(totalRows / filters.pageSize)}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>

      <DeleteDialog
        id={currentID}
        name={dangDungList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        onForceUpdate={onForceUpdate}
      />

      <FormDialog
        currentID={currentID}
        data={dangDungList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={() => setOpenFormDialog(false)}
      />
    </TableWrapper>
  );
};

export default TableData;

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
import { defaultFilters } from 'constants/defaultFilters';
import { ITreatmentGroup } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import treatmentGroupService from 'services/treatmentGroup.service';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialog from '../FormDialog';

const getCells = (): Cells<ITreatmentGroup> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'name',
    label: 'Tên nhóm sản phẩm',
  },
  {
    id: 'description',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [treatmentGroupList, setTreatmentGroupList] = useState<
    ITreatmentGroup[]
  >([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = () => {
    treatmentGroupService
      .getAll(filters)
      .then(({ data }) => {
        setTreatmentGroupList(data.items ?? []);
        setTotalRows(Math.ceil(data?.totalCount / filters.pageSize));
      })
      .catch((err) => {
        console.log(err);
      })
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

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    setOpenFormDialog(false);
    if (updated) {
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!currentID) return;
    try {
      await treatmentGroupService.delete(currentID);
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const renderAction = (row: ITreatmentGroup) => {
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
        title="Danh sách nhóm sản phẩm"
        placeHolder="Tìm kiếm nhóm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Thêm mới nhóm sản phẩm
        </Button>
      </TableSearchField>

      <TableContent total={treatmentGroupList.length} loading={loading}>
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
                {treatmentGroupList.map((item) => {
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
          totalPages={totalRows}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>

      <DeleteDialog
        id={currentID}
        tableName="nhóm điều trị"
        name={treatmentGroupList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
      />

      <FormDialog
        currentID={currentID}
        data={treatmentGroupList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
      />
    </TableWrapper>
  );
};

export default TableData;

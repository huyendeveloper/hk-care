import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import LinkIconButton from 'components//common/LinkIconButton';
import LinkButton from 'components/common/LinkButton';
import Scrollbar from 'components/common/Scrollbar';
import SeverityBadge from 'components/Table/SeverityBadge';
import TableAvatar from 'components/Table/TableAvatar';
import TableContent from 'components/Table/TableContent';
import type { Cells } from 'components/Table/TableHeader';
import TableHeader from 'components/Table/TableHeader';
import TablePagination from 'components/Table/TablePagination';
import TableSearchField from 'components/Table/TableSearchField';
import TableWrapper from 'components/Table/TableWrapper';
import useForceUpdate from 'hooks/useForceUpdate';
import useMounted from 'hooks/useMounted';
import { useEffect, useMemo, useState } from 'react';
import { ExampleCRUD, getListExampleCRUD } from 'services/crud';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormatFns from 'utils/DateFns';
import DeleteDialog from './DeleteDialog';

interface Data {
  id: number;
  image: string;
  textField: string;
  selectField: number;
  mutipleSelectField: number[];
  radioField: number;
  switchField: boolean;
  date: string;
  time: string;
  actions: string;
}

// table title cell
const getCells = (): Cells<Data> => [
  {
    id: 'id',
    label: 'Id',
  },
  {
    id: 'image',
    label: 'Image',
  },
  {
    id: 'textField',
    label: 'Text Field',
  },
  {
    id: 'selectField',
    label: 'Select field id',
  },
  {
    id: 'mutipleSelectField',
    label: 'Mutiple select field id',
  },
  {
    id: 'radioField',
    label: 'Radio field id',
  },
  {
    id: 'switchField',
    label: 'Switch field',
  },
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'time',
    label: 'Time',
  },
  {
    id: 'actions',
    label: 'Action',
  },
];

const ExampleCRUDTable = () => {
  const mounted = useMounted(); // use to handle unmounting event: don't update when component unmounte
  const [rerender, onForceUpdate] = useForceUpdate(); // use force update when re-render list
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [exampleCRUDList, setExampleCRUDList] = useState<ExampleCRUD[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // loading when data is fetching
  const [currentCRUDId, setCurrentCRUDId] = useState<number | null>(null); //use for dialog

  // #region Filters
  const [filters, setFilters] = useState<FilterParams>({
    pageIndex: 1,
    pageSize: 5,
    sortBy: '',
    sortDirection: '',
    searchText: '',
  });
  // #endregion

  // get table cell, Can use multi-language
  const cells = useMemo(() => getCells(), []);

  // call api to get list data
  useEffect(() => {
    setLoading(true);
    getListExampleCRUD(filters)
      .then((res) => {
        setExampleCRUDList(res.data ?? []);
        setTotalRows(res.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters, mounted, rerender]);

  // Table actions
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
  // End Table actions

  const handleCloseDeleteDialog = () => {
    setCurrentCRUDId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentCRUDId(id);
    setOpenDeleteDialog(true);
  };

  //action of table
  const renderAction = (row: ExampleCRUD) => {
    return (
      <>
        {/* use LinkIconButton when want click a link */}
        <LinkIconButton to={`/example/crud/${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <LinkIconButton to={`/example/crud/${row.id}/edit`}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </LinkIconButton>

        {/* when open a dialog or something */}
        <IconButton onClick={handleOpenDeleteDialog(row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Example CRUD"
        placeHolder="Search Example CRUD"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <LinkButton
          variant="outlined"
          startIcon={<AddIcon />}
          to="/example/crud/create"
        >
          Create
        </LinkButton>
      </TableSearchField>
      <TableContent total={exampleCRUDList.length} loading={loading}>
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
                {exampleCRUDList.map((CRUD) => {
                  const {
                    id,
                    textField,
                    selectField,
                    mutipleSelectField,
                    radioField,
                    switchField,
                    date,
                    time,
                    image,
                  } = CRUD;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>
                        <TableAvatar src={image} placeholderIcon={PersonIcon} />
                      </TableCell>
                      <TableCell>{textField}</TableCell>
                      <TableCell>{selectField}</TableCell>
                      <TableCell>{mutipleSelectField.toString()}</TableCell>
                      <TableCell>{radioField}</TableCell>
                      <TableCell>
                        <SeverityBadge
                          color={switchField ? 'success' : 'error'}
                        >
                          {switchField ? 'True' : 'False'}
                        </SeverityBadge>
                      </TableCell>
                      <TableCell>
                        {FormatFns.formatDateTime(new Date(date), 'dd-MM-yyyy')}
                      </TableCell>
                      <TableCell>
                        {FormatFns.formatDateTime(new Date(time), 'HH:mm')}
                      </TableCell>
                      <TableCell align="left">{renderAction(CRUD)}</TableCell>
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
        id={currentCRUDId}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        onForceUpdate={onForceUpdate}
      />
    </TableWrapper>
  );
};

export default ExampleCRUDTable;

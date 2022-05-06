import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select, { selectClasses } from '@mui/material/Select';
import Typography from '@mui/material/Typography';

interface Props {
  pageIndex: number;
  totalPages: number;
  onChangePage: (pageIndex: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  isSmall?: boolean;
}

const TablePagination = (props: Props) => {
  const {
    pageIndex,
    totalPages,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
    isSmall = false,
  } = props;

  const handleChangePage = (_event: unknown, pageIndex: number) => {
    onChangePage(pageIndex);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    onChangeRowsPerPage(Number(event.target.value));
  };

  return (
    <Box sx={{ display: 'flex', p: 2, justifyContent: 'flex-end' }}>
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          mr: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Row per page
        </Typography>
        <FormControl sx={{ ml: 1, mr: 2 }}>
          <Select
            value={String(rowsPerPage)}
            onChange={handleChangeRowsPerPage}
            size="small"
            variant="standard"
            disableUnderline
            sx={{
              [`& .${selectClasses.select}`]: {
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                pb: 0,
              },
            }}
          >
            {rowsPerPageOptions.map((rowsPerPage) => (
              <MenuItem key={rowsPerPage} value={rowsPerPage}>
                {rowsPerPage}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {totalPages === 0 ? 0 : (pageIndex - 1) * rowsPerPage + 1}–
          {pageIndex * rowsPerPage} of {totalPages}
        </Typography>
      </Box>
      <Pagination
        page={pageIndex}
        count={totalPages}
        shape="rounded"
        showFirstButton={!isSmall}
        showLastButton={!isSmall}
        onChange={handleChangePage}
        size={isSmall ? 'small' : 'medium'}
      />
    </Box>
  );
};

export default TablePagination;

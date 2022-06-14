import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SearchField from './SearchField';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

interface Props extends BoxProps {
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
  title?: string;
  headerTitle?: string;
  searchArea?: boolean;
  setStart?: (date: string) => void;
  setEnd?: (date: string) => void;
}

const TableSearchField = (props: Props) => {
  const {
    title,
    placeHolder,
    searchText,
    onSearch,
    children,
    headerTitle,
    searchArea,
    setStart,
    setEnd,
    ...rest
  } = props;
  return (
    <Wrapper {...rest}>
      {headerTitle && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 1.5, fontWeight: 'regular' }}
        >
          {headerTitle}
        </Typography>
      )}

      <SearchField
        title={title}
        placeHolder={placeHolder}
        onSearch={onSearch}
        searchText={searchText}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={1}>
            {children}
          </Stack>
        </Box>
      </SearchField>
      {searchArea && (
        <Stack
          flexDirection="row"
          gap={1}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <TextField
            type="date"
            variant="outlined"
            onChange={(e) => setStart && setStart(e.target.value)}
          />
          <RemoveIcon />
          <TextField
            type="date"
            variant="outlined"
            onChange={(e) => setEnd && setEnd(e.target.value)}
          />
        </Stack>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

export default TableSearchField;

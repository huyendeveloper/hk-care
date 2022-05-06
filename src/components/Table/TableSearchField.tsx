import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SearchField from './SearchField';
import Typography from '@mui/material/Typography';

interface Props extends BoxProps {
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
  title?: string;
  headerTitle?: string;
}

const TableSearchField = (props: Props) => {
  const {
    title,
    placeHolder,
    searchText,
    onSearch,
    children,
    headerTitle,
    ...rest
  } = props;
  return (
    <Wrapper {...rest}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1}>
          {children}
        </Stack>
      </Box>
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
      />
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

export default TableSearchField;

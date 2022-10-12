import { Stack } from '@mui/material';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import { useDebounce } from 'react-use';
import type { ChangeEvent, KeyDownEvent } from 'types';

interface Props extends BoxProps {
  title?: string;
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
  haveIcon?: boolean;
}

const SearchField = (props: Props) => {
  const {
    title,
    searchText,
    placeHolder,
    onSearch,
    children,
    haveIcon,
    ...rest
  } = props;
  const [value, setValue] = useState<string>('');

  const handleChange: ChangeEvent = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown: KeyDownEvent = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSearch(value);
    }
  };

  useDebounce(
    () => {
      if (searchText !== value) {
        onSearch(value);
      }
    },
    1500,
    [value]
  );

  if (haveIcon) {
    return (
      <Stack
        flexDirection="row"
        style={{ position: 'relative', width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            justifyContent: 'space-between',
          }}
        >
          {title ? (
            <FormLabel htmlFor="search">
              <Typography gutterBottom sx={{ mb: 0, fontSize: '1.74rem' }}>
                {title}
              </Typography>
            </FormLabel>
          ) : null}
          {children}
        </Box>
        <TextField
          id="search"
          fullWidth
          placeholder={placeHolder}
          // @ts-nocheck
          // variant="outlined"
          // @ts-ignore
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{
            mr: 1,
            display: 'grid',
            flexGrow: 1,
            backgroundColor: 'white',
            borderRadius: '4px',
          }}
          {...rest}
        />
        {/* <SearchIcon
          fontSize="medium"
          style={{ position: 'absolute', right: '20', top: '23%' }}
          color="disabled"
        /> */}
      </Stack>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        {title ? (
          <FormLabel htmlFor="search">
            <Typography gutterBottom sx={{ mb: 0, fontSize: '1.74rem' }}>
              {title}
            </Typography>
          </FormLabel>
        ) : null}
        {children}
      </Box>
      <TextField
        id="search"
        fullWidth
        placeholder={placeHolder}
        // @ts-nocheck
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        sx={{
          mr: 1,
          flexGrow: 1,
          backgroundColor: 'white',
          borderRadius: '4px',
        }}
      />
    </>
  );
};

export default memo(SearchField);

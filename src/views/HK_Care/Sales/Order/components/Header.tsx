import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { TabList } from '@mui/lab';
import { IconButton, Stack, Tab } from '@mui/material';
import { Box } from '@mui/system';
import { LinkIconButton } from 'components/common';
import SearchField from 'components/Table/SearchField';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { ISearchProduct } from 'interface';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import salesOrderService from 'services/salesOrder.service';
import { FilterParams } from 'types';

interface IProps {
  tab: string;
  handleAddTab: () => void;
  handleRemoveTab: (index: number) => void;
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
  ids: number[];
  addItem: (item: any) => void;
}

const Header = ({
  tab,
  ids,
  handleAddTab,
  handleRemoveTab,
  handleChange,
  addItem,
}: IProps) => {
  const { id } = useParams();
  const [products, setProducts] = useState<ISearchProduct[]>([]);
  const [hidden, setHidden] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
      pageSize: 1000,
    }));
  };

  const fetchProductSearchList = async () => {
    const { data } = await salesOrderService.getSearchProductList(filters);
    setProducts(data.items);
  };

  useEffect(() => {
    fetchProductSearchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleClose = () => {
    setHidden(true);
  };

  const timer = () => {
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ backgroundColor: '#3f9f36', paddingX: 4 }}
    >
      <Stack flexDirection="row" flexWrap="wrap">
        <Box
          sx={{
            paddingY: 1,
            width: '250px',
            maxWidth: '100%',
            position: 'relative',
          }}
        >
          <SearchField
            placeHolder="Thêm sản phẩm vào đơn"
            searchText=""
            onSearch={handleSearch}
            haveIcon
            onFocus={() => setHidden(false)}
            onBlur={timer}
          />
          {!hidden && products.length > 0 && (
            <Stack
              sx={{
                position: 'absolute',
                top: '55px',
                right: '-200px',
                left: 0,
                marginRight: '8px',
                borderRadius: '4px',
                background: 'white',
                border: '1px solid #d9d9d9',
                maxHeight: '350px',
                overflowY: 'scroll',
                zIndex: 99,
              }}
            >
              {products.map((item, index) => (
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  key={index}
                  onClick={() => addItem({ ...item, quantity: 1 })}
                  p={2}
                  sx={{ borderBottom: '1px solid #d9d9d9' }}
                >
                  <Stack flexDirection="row">
                    <Box
                      component="img"
                      sx={{
                        width: '100px',
                        height: '70px',
                      }}
                      src={`${connectURL}/${item.productImage}`}
                      alt=""
                    />
                    <Box pl={2}>{item.productName}</Box>
                  </Stack>
                  <div>Có thể bán: {item.stockQuantity}</div>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>

        <TabList onChange={handleChange}>
          {ids.map((item, index) => (
            <Tab
              key={index}
              label={
                <React.Fragment>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      backgroundColor:
                        tab === index.toString() ? 'white' : '#c3c3c3',
                      pl: 2,
                      pr: 1,
                      width: '145px',
                      marginX: '4px',
                      marginY: '5px',
                      borderRadius: '8px',
                    }}
                  >
                    Hóa đơn {item}
                    <Stack
                      justifyContent="center"
                      p={1}
                      onClick={() => handleRemoveTab(index)}
                    >
                      <CloseIcon />
                    </Stack>
                  </Stack>
                </React.Fragment>
              }
              sx={{ my: '5px', p: 0 }}
              value={index.toString()}
            />
          ))}
        </TabList>

        {ids.length < 9 && !id && (
          <Stack flexDirection="row" alignItems="center">
            <IconButton onClick={handleAddTab}>
              <AddIcon fontSize="large" style={{ color: 'white' }} />
            </IconButton>
          </Stack>
        )}
      </Stack>
      <LinkIconButton to="/">
        <HomeIcon fontSize="large" style={{ color: 'white' }} />
      </LinkIconButton>
    </Stack>
  );
};

export default Header;

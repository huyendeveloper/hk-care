import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import { LinkButton, PageWrapper } from 'components/common';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormPaperGrid
} from 'components/Form';
import { useNotification } from 'hooks';
import { IProductList } from 'interface';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registProductList } from 'redux/slices/productList';
import ProductListTableData from './ProductListTableData';
import ProductTableData from './ProductTableData';

const Create = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [registerList, setRegisterList] = useState<IProductList[]>([]);
  const [unregisterList, setUnregisterList] = useState<IProductList[]>([]);
  const [rerender, setRerender] = useState<number>(0);

  const handleRegist = (item: IProductList) => {
    setRegisterList([...registerList, item]);
  };

  const handleUnregist = (item: IProductList) => {
    setUnregisterList([...unregisterList, item]);
  };

  const handleCancelRegist = (id: number) => {
    setRegisterList([...registerList.filter((x) => x.productId !== id)]);
  };

  const handleSubmit = async () => {
    if (registerList.length === 0) {
      setNotification({
        message: 'Không có thay đổi nào!',
        severity: 'success',
      });
      return;
    }

    if (registerList.length > 0) {
      const { error } = await dispatch(
        // @ts-ignore
        registProductList(registerList)
      );
      if (error) {
        setNotification({ error: 'Lỗi khi đăng ký sản phẩm!' });
        return;
      }
      setNotification({ message: 'Đăng ký thành công', severity: 'success' });
      setRerender((pre) => pre + 1);
      setRegisterList([]);
    }
  };

  return (
    <PageWrapper title="Đăng ký sản phẩm">
      <FormPaperGrid>
        <FormHeader title="" />
        <FormContent>
          <Grid container height={1} spacing={2}>
            <Grid item xs={12} md={6}>
              <ProductTableData
                handleRegist={handleRegist}
                registerList={registerList}
                handleCancelRegist={handleCancelRegist}
                rerender={rerender}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductListTableData
                handleUnregist={handleUnregist}
                registerList={registerList}
                handleCancelRegist={handleCancelRegist}
              />
            </Grid>
          </Grid>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/product/list">Quay lại</LinkButton>
          <LoadingButton onClick={handleSubmit}>Lưu</LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapper>
  );
};

export default Create;

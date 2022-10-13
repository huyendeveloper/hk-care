import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import { LinkButton, PageWrapper } from 'components/common';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormPaperGrid,
} from 'components/Form';
import { useNotification } from 'hooks';
import { IProductList } from 'interface';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registProductList } from 'redux/slices/productList';
import ProductListTableData from './ProductListTableData';
import ProductTableData from './ProductTableData';

const Create = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const [rerender, setRerender] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [registerList, setRegisterList] = useState<IProductList[]>([]);

  const handleRegist = (item: IProductList) => {
    setRegisterList([...registerList, item]);
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
    setLoading(true);
    if (registerList.length > 0) {
      const { error } = await dispatch(
        // @ts-ignore
        registProductList(registerList)
      );
      if (error) {
        setNotification({ error: 'Hệ thống đang gặp sự cố' });
        setLoading(false);
        return;
      }
      setNotification({ message: 'Đăng ký thành công', severity: 'success' });
      setRerender((pre) => pre + 1);
      setRegisterList([]);
      setLoading(false);
      return navigate('/hk_care/product/list');
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
                rerender={rerender}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductListTableData
                registerList={registerList}
                handleCancelRegist={handleCancelRegist}
              />
            </Grid>
          </Grid>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/product/list">Quay lại</LinkButton>
          <LoadingButton loading={loading} onClick={handleSubmit}>
            Lưu
          </LoadingButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapper>
  );
};

export default Create;

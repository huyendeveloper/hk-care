import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: FC = () => {
  return (
    <MainLayoutRoot>
      <Outlet />
    </MainLayoutRoot>
  );
};

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
  paddingTop: 64,
}));

export default MainLayout;

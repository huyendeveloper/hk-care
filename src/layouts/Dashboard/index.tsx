import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardFooter from './DashboardFooter';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout: FC = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(true);

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleToggleMobileSidebar = () => {
    setOpenMobileSidebar(!openMobileSidebar);
  };

  const handleCloseMobileSidebar = () => {
    setOpenMobileSidebar(false);
  };

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar
        onToggleMobileSidebar={handleToggleMobileSidebar}
        onToggleDrawer={handleToggleDrawer}
        openDrawer={openDrawer}
      />
      <DashboardLayoutContent>
        <Outlet />
      </DashboardLayoutContent>
      <DashboardSidebar
        onCloseMobileSidebar={handleCloseMobileSidebar}
        openMobileSidebar={openMobileSidebar}
      />
      <DashboardFooter />
    </DashboardLayoutRoot>
  );
};

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280,
  },
}));

const DashboardLayoutContent = styled('main')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export default DashboardLayout;

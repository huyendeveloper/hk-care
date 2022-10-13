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

  const handleCloseSidebar = () => {
    setOpenDrawer(false);
  };

  const handleCloseMobileSidebar = () => {
    setOpenMobileSidebar(false);
  };

  return (
    // @ts-ignore
    <DashboardLayoutRoot openDrawer={openDrawer}>
      <DashboardNavbar
        onToggleMobileSidebar={handleToggleMobileSidebar}
        onToggleDrawer={handleToggleDrawer}
        openDrawer={openDrawer}
      />
      <DashboardLayoutContent>
        <Outlet />
      </DashboardLayoutContent>
      <DashboardSidebar
        handleCloseSidebar={handleCloseSidebar}
        onCloseMobileSidebar={handleCloseMobileSidebar}
        openDrawer={openDrawer}
        openMobileSidebar={openMobileSidebar}
      />
      <DashboardFooter />
    </DashboardLayoutRoot>
  );
};

const DashboardLayoutRoot = styled('div')((prop) => {
  // @ts-ignore
  const { theme, openDrawer } = prop;
  return {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 55,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: openDrawer ? 240 : 0,
    },
  };
});

const DashboardLayoutContent = styled('main')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export default DashboardLayout;

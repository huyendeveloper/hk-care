import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import RouteLink from 'components/common/RouteLink';
import Scrollbar from 'components/common/Scrollbar';
import usePrevious from 'hooks/usePrevious';
import type { FC } from 'react';
import { Fragment, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface Props {
  onCloseMobileSidebar: () => void;
  openMobileSidebar: boolean;
}

const DashboardSidebar: FC<Props> = (props) => {
  const { onCloseMobileSidebar, openMobileSidebar } = props;
  const { pathname } = useLocation();
  const prevPathName = usePrevious(pathname);

  useEffect(() => {
    if (prevPathName !== pathname && openMobileSidebar) {
      onCloseMobileSidebar();
    }
  }, [pathname, onCloseMobileSidebar, openMobileSidebar, prevPathName]);

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Hidden lgUp>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <RouteLink to="/">Logo</RouteLink>
          </Box>
        </Hidden>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              px: 2,
              py: 1.5,
            }}
          >
            <Box
              component="img"
              sx={{
                width: '100%',
                mb: 2,
              }}
              alt="hk care logo"
              src="/static/logo.png"
            />
          </Box>
        </Box>
        <Sidebar />
      </Box>
    </Scrollbar>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={openMobileSidebar}
          onClose={onCloseMobileSidebar}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              width: 280,
            },
          }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              height: '100% !important',
              width: 280,
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </Fragment>
  );
};

interface UserAvatarProps {
  src: string | null;
}

const UserAvatar = (props: UserAvatarProps) => {
  const { src } = props;
  return (
    <Avatar alt="Avatar" src={src || ''}>
      <PersonIcon />
    </Avatar>
  );
};

export default DashboardSidebar;

import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material';
import type { AppBarProps } from '@mui/material/AppBar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import LinkIconButton from 'components/common/LinkIconButton';
import LogoutConfirmDialog from 'components/common/LogoutConfirmDialog';
import useMounted from 'hooks/useMounted';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from 'redux/slices';

interface Props extends AppBarProps {
  onToggleMobileSidebar: () => void;
  openDrawer: boolean;
  onToggleDrawer: () => void;
}

const DashboardNavbar: FC<Props> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { onToggleMobileSidebar, openDrawer } = props;
  // const { logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    if (mounted.current) {
      setOpenLogoutDialog(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    return navigate('/login');
  };

  return (
    <StyledAppBar open={openDrawer} elevation={0}>
      <Toolbar>
        {/* <Hidden lgDown>
          <IconButton edge="start">
            <MenuIcon />
          </IconButton>
        </Hidden> */}
        <Hidden lgUp>
          <IconButton onClick={onToggleMobileSidebar}>
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <Stack direction="row" spacing={0.5}>
            <LinkIconButton to="/user/profile">
              <IconButton>
                <PersonIcon />
              </IconButton>
            </LinkIconButton>
            <IconButton onClick={handleOpenLogoutDialog}>
              <LogoutIcon sx={{ mr: 1 }} />
              <Typography color="text.secondary">Đăng xuất</Typography>
            </IconButton>
          </Stack>
          <LogoutConfirmDialog
            open={openLogoutDialog}
            onClose={handleCloseLogoutDialog}
            onSubmit={handleLogout}
            content={{
              label: 'Đăng xuất',
              icon: LogoutIcon,
            }}
          />
        </Hidden>
      </Toolbar>
      <Divider />
    </StyledAppBar>
  );
};

interface StyledAppBarProps extends AppBarProps {
  open: boolean;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop: string) => !['open'].includes(prop),
})<StyledAppBarProps>(({ theme, open }) => ({
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 280,
    width: 'calc(100% - 280px)',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down('lg')]: {
    marginLeft: 'revert',
    width: '100%',
  },
}));

export default DashboardNavbar;

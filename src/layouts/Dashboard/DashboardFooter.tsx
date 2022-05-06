import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { version } from 'utils/constants';

const DashboardFooter = () => {
  return (
    <Box>
      <Divider />
      <DashboardFooterRoot>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            TMS Version {version}.
          </Typography>{' '}
          <Typography variant="caption">
            Copyright ©{' '}
            <Link href="#">www.example.com</Link>
          </Typography>
        </Box>
        <Typography variant="caption">
          Made with <StyledSpan>&#10084;</StyledSpan> in VN.
        </Typography>
      </DashboardFooterRoot>
    </Box>
  );
};

const DashboardFooterRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  height: 40,
  padding: '8px 16px',
  backgroundColor: theme.palette.background.paper,
}));

const StyledSpan = styled('span')({
  color: 'red',
});

export default DashboardFooter;

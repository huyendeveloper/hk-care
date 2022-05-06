import type { SvgIconComponent } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  icon: SvgIconComponent;
  description?: string;
}

const DialogHeader = (props: Props) => {
  const { title, icon: Icon, description } = props;
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Icon sx={{ fontSize: 70, color: 'text.secondary' }} />
        <Typography
          sx={{ mt: 1 }}
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="subtitle2">{description}</Typography>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default DialogHeader;

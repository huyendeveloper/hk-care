import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface Props extends BoxProps {
  title: string;
  description?: string;
  hidden?: boolean;
}

const FormHeader = (props: Props) => {
  const { title, description, children, hidden, ...rest } = props;

  return hidden ? (
    <></>
  ) : (
    <Box sx={{ mb: 2 }} {...rest}>
      <Typography
        color="text.secondary"
        sx={{ mb: 1.5, fontWeight: 'regular', fontSize: '1.74rem' }}
      >
        {title}
      </Typography>
      <Divider />
      {children ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: -1 }}
        >
          <Stack direction="row" spacing={1}>
            {children}
          </Stack>
        </Box>
      ) : null}
      {description && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 'light', mt: 1 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default FormHeader;

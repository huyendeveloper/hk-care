import BlockIcon from '@mui/icons-material/Block';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  id: number | null;
  name?: string;
  handleBlock: () => void;
  tableName: string;
}

const BlockDialog = (props: Props) => {
  const { open, onClose, name = '', handleBlock, tableName } = props;

  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose} scroll="body">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <BlockIcon sx={{ fontSize: 70, color: 'text.secondary' }} />
        <Typography variant="h6">Vô hiệu hóa hoạt động</Typography>
      </Box>
      <Divider />
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          Bạn có chắc chắn bạn muốn vô hiệu hóa hoạt động của {tableName}{' '}
          {<strong>{name}</strong>}?
        </Typography>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <LoadingButton color="error" onClick={handleBlock}>
            Xóa
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default BlockDialog;

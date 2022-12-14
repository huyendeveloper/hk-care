import DeleteIcon from '@mui/icons-material/Delete';
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
  id: number | string | null;
  name?: string;
  handleDelete: () => void;
  tableName: string;
  spanContent?: string;
  message?: string;
  type?: string;
  loading?: boolean;
  forwardContent?: React.ReactNode;
  textAlign?: string;
}

const DeleteDialog = (props: Props) => {
  const {
    open,
    onClose,
    name = '',
    handleDelete,
    tableName,
    spanContent = '',
    message,
    type = 'Xóa',
    loading,
    forwardContent,
    textAlign = 'center',
  } = props;

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
        <DeleteIcon sx={{ fontSize: 70, color: 'text.secondary' }} />
        <Typography variant="h6">
          {type} {tableName}
        </Typography>
      </Box>
      <Divider />
      <DialogContent>
        {forwardContent && (
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ textAlign: 'center' }}
          >
            {forwardContent}
          </Typography>
        )}
        <Typography variant="subtitle1" gutterBottom sx={{ textAlign }}>
          {message ||
            `Bạn có chắc chắn bạn muốn ${type.toLocaleLowerCase()} ${tableName} ${name}${spanContent}?`}
        </Typography>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <LoadingButton loading={loading} onClick={handleDelete}>
            {type}
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default DeleteDialog;

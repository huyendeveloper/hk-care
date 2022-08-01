import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Stack,
  Tooltip
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LeftCabinet = ({
  cabinetNumber,
  buttonLabel,
  tooltip,
}: {
  cabinetNumber: number;
  buttonLabel?: string;
  tooltip?: string;
}) => {
  return (
    <Stack flexDirection="row" gap={1} mb={1}>
      <Tooltip title={tooltip || ''} placement="right">
        <Button variant="outlined">Tủ {cabinetNumber}</Button>
      </Tooltip>
      <Button sx={buttonLabel ? { backgroundColor: '#da6a04' } : {}}>
        {buttonLabel}
      </Button>
    </Stack>
  );
};

const RightCabinet = ({
  cabinetNumber,
  tooltip,
}: {
  cabinetNumber: number;
  tooltip?: string;
}) => {
  return (
    <Stack flexDirection="row" gap={1} mb={1}>
      <Button></Button>
      <Tooltip title={tooltip || ''} placement="right">
        <Button variant="outlined">Tủ {cabinetNumber}</Button>
      </Tooltip>
    </Stack>
  );
};

const BottomCabinet = ({ cabinetNumber }: { cabinetNumber: number }) => {
  return (
    <Stack gap={1} mr={1}>
      <Button sx={{ color: '#00AB55' }}>.</Button>
      <Button variant="outlined">Tủ {cabinetNumber}</Button>
    </Stack>
  );
};

const MapDialog = (props: Props) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose} scroll="body">
      <DialogContent sx={{ pt: '40px', pb: '40px' }}>
        <Grid container>
          <Grid item xs={3}>
            <LeftCabinet
              cabinetNumber={1}
              tooltip="Khu thuốc kiểm soát đặc biệt"
            />

            <LeftCabinet
              cabinetNumber={2}
              buttonLabel={'KSDB'}
              tooltip="Khu TPCN khớp"
            />
            <LeftCabinet cabinetNumber={3} />
          </Grid>
          <Grid item xs={6}>
            <Stack flexDirection="row" justifyContent="center" gap={1}>
              <Button>QUẦY THU NGÂN</Button>
              <Button>MẶT BÀN TƯ VẤN</Button>
            </Stack>
            <Grid container>
              <Grid item xs={1}></Grid>
              <Grid
                item
                xs={10}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                mt={3}
              >
                <Button variant="outlined">Kệ 1</Button>
                <Button variant="outlined">Kệ 2</Button>
                <Button variant="outlined">Kệ 3</Button>
                <Button variant="outlined">Kệ 1</Button>
                <Button variant="outlined">Kệ 2</Button>
                <Button variant="outlined">Kệ 3</Button>
                <Button variant="outlined">Kệ 1</Button>
                <Button variant="outlined">Kệ 2</Button>
                <Button variant="outlined">Kệ 3</Button>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex' }} mt={3}>
              <BottomCabinet cabinetNumber={4} />
              <BottomCabinet cabinetNumber={5} />
              <BottomCabinet cabinetNumber={6} />
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <RightCabinet cabinetNumber={11} tooltip="Thuốc điều trị Covid" />
            <RightCabinet cabinetNumber={10} />
            <RightCabinet cabinetNumber={9} />
            <RightCabinet cabinetNumber={8} />
            <RightCabinet cabinetNumber={7} />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onClose}>
            Đóng
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default MapDialog;

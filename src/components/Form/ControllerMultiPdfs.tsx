import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack } from '@mui/material';
import { useNotification } from 'hooks';

interface IProps {
  files: File[] | object[];
  setFiles: (files: File[] | object[]) => void;
  accept?: string;
  message?: string;
}

const ControllerMultiPdfs = ({
  files,
  setFiles,
  accept = 'application/pdf',
  message = 'File không đúng định dạng',
}: IProps) => {
  const setNotification = useNotification();

  const handleChangeFile = (e: any) => {
    const fileList = e?.target.files;
    let newFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i]) {
        if (fileList[i].type === 'application/pdf') {
          newFiles.push(fileList[i]);
        } else {
          setNotification({
            message,
            severity: 'warning',
          });
        }
      }
    }
    setFiles(newFiles);
  };

  return (
    <>
      <Stack
        height={1}
        bgcolor="#00AB55"
        color={'white'}
        justifyContent="center"
        alignContent={'center'}
        gap={1}
        flexDirection="row"
      >
        <Button variant="contained" fullWidth component="label">
          {files.length === 0
            ? 'Chọn file'
            : // @ts-ignore
              files.reduce((pre, cur) => pre + cur.name + ' ', '')}

          <input
            type="file"
            name="bussinessLicense"
            accept={accept}
            onChange={(e) => {
              handleChangeFile(e);
              e.target.value = '';
            }}
            multiple
            max={6}
            hidden
          />
        </Button>
        {files.length > 0 && (
          <Stack justifyContent="center" style={{ cursor: 'pointer' }}>
            <VisibilityIcon />
          </Stack>
        )}
        {files.length > 0 && (
          <Stack
            pr={1}
            justifyContent="center"
            onClick={() => setFiles([])}
            style={{ cursor: 'pointer' }}
          >
            <RemoveCircleIcon />
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ControllerMultiPdfs;

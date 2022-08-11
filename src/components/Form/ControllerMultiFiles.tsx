import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack } from '@mui/material';
import { connectURL } from 'config';
import { useNotification } from 'hooks';

interface IProps {
  files: File[] | object[];
  setFiles: (files: File[] | object[]) => void;
  accept?: string;
  message?: string;
  max?: number;
  disabled?: boolean;
}

const ControllerMultiFiles = ({
  files,
  setFiles,
  accept = 'image/*,application/pdf',
  message = 'File không đúng định dạng',
  max = 6,
  disabled = false,
}: IProps) => {
  const setNotification = useNotification();

  const handleChangeFile = (e: any) => {
    const fileList = e?.target.files;
    if (fileList.length > max) {
      setNotification({
        message: `Có thể chọn tối đa ${max} file.`,
        severity: 'warning',
      });
      return;
    }
    let newFiles = [];
    for (let i = 0; i < max; i++) {
      if (fileList[i]) {
        if (
          fileList[i].type === 'application/pdf' ||
          fileList[i].type.substr(0, 5) === 'image'
        ) {
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

  const handleView = () => {
    // @ts-ignore
    files.forEach(({ url }) => {
      window.open(connectURL + `/${url}`, '_blank');
    });
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
            hidden
            disabled={disabled}
          />
        </Button>
        {files.length > 0 && (
          <Stack
            pr={disabled ? 1 : 0}
            justifyContent="center"
            style={{ cursor: 'pointer' }}
            onClick={handleView}
          >
            <VisibilityIcon />
          </Stack>
        )}
        {files.length > 0 && !disabled && (
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

export default ControllerMultiFiles;

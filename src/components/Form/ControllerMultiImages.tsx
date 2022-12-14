import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack } from '@mui/material';
import { useNotification } from 'hooks';

interface IProps {
  files: File[] | object[];
  setFiles: (files: File[] | object[]) => void;
  accept?: string;
  message?: string;
  handleView: () => void;
  disabled?: boolean;
}

const ControllerMultiImages = ({
  files,
  setFiles,
  accept = 'image/*',
  message = 'File không đúng định dạng',
  handleView,
  disabled,
}: IProps) => {
  const setNotification = useNotification();

  const handleChangeFile = (e: any) => {
    const fileList = e?.target.files;
    let newFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i]) {
        if (fileList[i].type.substr(0, 5) === 'image') {
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
        <Button
          variant="contained"
          sx={disabled ? { cursor: 'default' } : {}}
          fullWidth
          component="label"
        >
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
            justifyContent="center"
            style={{ cursor: 'pointer' }}
            onClick={handleView}
          >
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

export default ControllerMultiImages;

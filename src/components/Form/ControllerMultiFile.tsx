import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack } from '@mui/material';
import { useNotification } from 'hooks';
import React from 'react';

interface IProps {
  files: File[] | object[];
  setFiles: (files: File[] | object[]) => void;
  viewOnly?: boolean;
  max?: number;
  accept?: string;
}

const ControllerMultiFile = ({
  files,
  setFiles,
  viewOnly,
  max = 6,
  accept = 'application/pdf',
}: IProps) => {
  const setNotification = useNotification();
  const handleChangeFile = (e: any) => {
    const file = e?.target.files[0];
    if (file) {
      setFiles([...files, file]);
    }
  };

  const handleChangeFileIndex = (e: any, index: number) => {
    const file = e?.target.files[0];
    if (file) {
      if (
        file &&
        (file.type === 'application/pdf' || file.type.substr(0, 5) === 'image')
      ) {
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);
      } else {
        setNotification({
          message: 'File không đúng định dạng',
          severity: 'warning',
        });
      }
    }
  };

  const removeItem = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <>
      {files.map((item, index) => (
        <Stack
          key={index}
          flexDirection={'row'}
          alignContent="center"
          mb={'20px'}
        >
          <Button variant="contained" fullWidth component="label">
            {/* @ts-ignore */}
            {item?.name
              ? // @ts-ignore
                item.name
              : 'Không có chứng nhận'}
            <input
              type="file"
              name="bussinessLicense"
              accept={accept}
              onChange={(e) => handleChangeFileIndex(e, index)}
              hidden
              disabled={viewOnly}
            />
          </Button>

          <div>
            <Stack
              height={1}
              bgcolor="#00AB55"
              color={'white'}
              justifyContent="center"
              alignContent={'center'}
              pr={1}
              gap={1}
            >
              {/* @ts-ignore */}
              {item?.name && !item.type && (
                // @ts-ignore
                // eslint-disable-next-line react/jsx-no-target-blank
                <a href={item?.name} target={'_blank'}>
                  <Stack
                    height={1}
                    bgcolor="#00AB55"
                    color={'white'}
                    justifyContent="center"
                    pr={1}
                  >
                    <VisibilityIcon />
                  </Stack>
                </a>
              )}
              {!viewOnly && (
                <Stack
                  onClick={() => removeItem(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <RemoveCircleIcon />
                </Stack>
              )}
            </Stack>
          </div>
        </Stack>
      ))}
      {files.length < max && !viewOnly && (
        <Button variant="contained" fullWidth component="label">
          Chọn file
          <input
            type="file"
            name="bussinessLicense"
            accept={accept}
            onChange={handleChangeFile}
            hidden
          />
        </Button>
      )}
    </>
  );
};

export default ControllerMultiFile;

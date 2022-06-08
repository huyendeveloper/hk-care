import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack } from '@mui/material';
import React from 'react';

interface IProps {
  files: File[] | object[];
  setFiles: (files: File[] | object[]) => void;
  viewOnly?: boolean;
  max?: number;
}

const ControllerMultiFile = ({
  files,
  setFiles,
  viewOnly,
  max = 6,
}: IProps) => {
  const handleChangeFile = (e: any) => {
    const file = e?.target.files[0];
    if (file) {
      setFiles([...files, file]);
    }
  };

  const handleChangeFileIndex = (e: any, index: number) => {
    const file = e?.target.files[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
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
        <Stack flexDirection={'row'} alignContent="center" mb={'20px'}>
          <Button key={index} variant="contained" fullWidth component="label">
            {/* @ts-ignore */}
            {item?.name
              ? // @ts-ignore
                item.name
              : 'Không có chứng nhận'}
            <input
              type="file"
              name="bussinessLicense"
              accept="application/pdf"
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
              <Stack
                onClick={() => removeItem(index)}
                style={{ cursor: 'pointer' }}
              >
                <RemoveCircleIcon />
              </Stack>
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
            accept="application/pdf"
            onChange={handleChangeFile}
            hidden
          />
        </Button>
      )}
    </>
  );
};

export default ControllerMultiFile;

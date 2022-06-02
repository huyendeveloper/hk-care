import React, { useEffect } from 'react';
import { Button, IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface IProps {
  files: File[] | object[];
  setFiles: (files: File[] | object[]) => void;
  viewOnly?: boolean;
}

const ControllerMultiFile = ({ files, setFiles, viewOnly }: IProps) => {
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
          {/* @ts-ignore */}
          {item?.name && !item.type && (
            // @ts-ignore
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
        </Stack>
      ))}
      {files.length < 6 && !viewOnly && (
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

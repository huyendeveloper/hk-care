import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps extends DropzoneOptions {
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
}

const LogoDropzone: FC<FileDropzoneProps> = (props) => {
  const { accept, maxFiles, maxSize, minSize, onDrop } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
    multiple: false,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        border: 3,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderColor: 'divider',
        justifyContent: 'center',
        alignItems: 'center',
        ml: 1.5,
        ...(isDragActive && {
          backgroundColor: 'action.active',
          opacity: 0.5,
        }),
        '&:hover': {
          backgroundColor: 'action.hover',
          cursor: 'pointer',
          opacity: 0.5,
        },
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AddPhotoAlternateIcon fontSize="medium" color="action" />
        <Typography variant="caption" sx={{ mt: 1 }} color="text.secondary">
          Upload file
        </Typography>
      </Box>
    </Box>
  );
};

export default LogoDropzone;

import Box from '@mui/material/Box';

interface ImagePlaceHolderProps {
  src?: string;
  error?: string | null;
}

const ImagePlaceHolder = (props: ImagePlaceHolderProps) => {
  const { src, error } = props;
  return (
    <Box
      sx={{
        border: 3,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderColor: 'divider',
        height: 100,
        width: 100,
        position: 'relative',
        ...(src && {
          backgroundImage: `url(${src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          cursor: 'pointer',
        }),
        ...(error && {
          borderColor: 'error.main',
        }),
      }}
    />
  );
};

export default ImagePlaceHolder;

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface AddTabButtonProps {
  onCreate: () => void;
  visible: boolean;
}

const AddTabButton = (props: AddTabButtonProps) => {
  const { onCreate, visible } = props;

  if (!visible) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 1,
      }}
    >
      <Button variant="outlined" startIcon={<AddIcon />} onClick={onCreate}>
        Add
      </Button>
    </Box>
  );
};

export default AddTabButton;

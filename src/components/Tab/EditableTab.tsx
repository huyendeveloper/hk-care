import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { TabProps } from '@mui/material/Tab';
import Tab from '@mui/material/Tab';
import type { ClickEventCurrying } from 'types/react';

interface EditableTabProps extends TabProps {
  onDelete: ClickEventCurrying;
}

const EditableTab = (props: EditableTabProps) => {
  const { onDelete, value, ...rest } = props;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tab iconPosition="start" value={value} {...rest} />
      {onDelete && (
        <IconButton onClick={onDelete(value)} sx={{ ml: 1 }}>
          <ClearIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default EditableTab;

import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import type { SvgIconComponent } from '@mui/icons-material';

interface Props {
  src: string | null;
  placeholderIcon?: SvgIconComponent;
}

const TableAvatar = (props: Props) => {
  const { src, placeholderIcon: PlaceholderIcon = PersonIcon } = props;
  return (
    <Avatar alt="Avatar" src={src || ''} variant="rounded">
      <PlaceholderIcon />
    </Avatar>
  );
};

export default TableAvatar;

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import type { ListItemProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import { alpha } from '@mui/material/styles';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

interface Props extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  depth: number;
  icon?: ReactNode;
  info?: () => JSX.Element | null;
  open?: boolean;
  path?: string;
  title: string;
}

const SidebarItem: FC<Props> = (props) => {
  const {
    active,
    children,
    depth,
    icon,
    info: Info,
    open,
    path,
    title,
    ...other
  } = props;

  const [expanded, setExpanded] = useState<boolean>(Boolean(open));

  const handleOnToggle = (): void => {
    setExpanded((expanded) => !expanded);
  };

  let paddingLeft = 8 * 3;

  if (depth > 0) {
    paddingLeft = 40 + 8 * depth;
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        disablePadding
        sx={{ display: 'block' }}
        {...other}
      >
        <Button
          endIcon={
            expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />
          }
          onClick={handleOnToggle}
          startIcon={icon}
          sx={{
            color: active ? 'primary.main' : 'text.secondary',
            fontWeight: 'medium',
            justifyContent: 'flex-start',
            pl: `${paddingLeft}px`,
            pr: 2,
            py: 1.5,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            borderRadius: 0,
          }}
          variant="text"
        >
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {title}
            <Box sx={{ pl: 2 }}>{Info && <Info />}</Box>
          </Box>
        </Button>
        <Collapse in={expanded}>{children}</Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem disableGutters disablePadding sx={{ display: 'flex' }}>
      <Button
        variant="text"
        startIcon={icon}
        sx={{
          color: 'text.secondary',
          justifyContent: 'flex-start',
          pl: `${paddingLeft}px`,
          pr: 2,
          py: 1.5,
          textAlign: 'left',
          textTransform: 'none',
          width: '100%',
          fontWeight: 'medium',
          borderRadius: 0,
          ...(active && {
            color: 'primary.main',
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
          }),
        }}
        {...(path && {
          component: RouterLink,
          to: path,
        })}
      >
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {title}
          <Box sx={{ pl: 2 }}>{Info && <Info />}</Box>
        </Box>
      </Button>
    </ListItem>
  );
};

export default SidebarItem;

import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';

export type Severity =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'warning'
  | 'success'
  | 'grey';

interface SeverityBadgeProps {
  color: Severity;
  sx?: SxProps<Theme>;
}

const SeverityBadge: FC<SeverityBadgeProps> = (props) => {
  const { color = 'primary', children, ...other } = props;

  return (
    <SeverityBadgeRoot severity={color} {...other}>
      {children}
    </SeverityBadgeRoot>
  );
};

const SeverityBadgeRoot = styled('span')<{
  severity: Severity;
}>(({ theme, severity }) => {
  const backgroundColor =
    severity === 'grey'
      ? theme.palette[severity]['400']
      : theme.palette[severity].main;
  const color =
    severity === 'grey'
      ? theme.palette.getContrastText(backgroundColor)
      : theme.palette[severity].contrastText;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    color,
    backgroundColor,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 2,
    minWidth: 20,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    whiteSpace: 'nowrap',
  };
});

export default SeverityBadge;

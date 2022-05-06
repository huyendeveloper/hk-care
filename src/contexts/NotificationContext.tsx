import CloseIcon from '@mui/icons-material/Close';
import type { AlertProps } from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import type { FC } from 'react';
import {
  createContext,
  forwardRef,
  Fragment,
  useCallback,
  useState,
} from 'react';
import type { PickUnion } from 'types';

const AlertMessage = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert elevation={6} ref={ref} variant="filled" {...props} />
));
interface Config {
  message: string | null;
  error: string | null;
  severity?: AlertProps['severity'];
  onUndo?: () => Promise<void>;
}

export type ContextValue = (config: PickUnion<Config>) => void;

export const NotificationContext = createContext<ContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  NotificationContext.displayName = 'NotificationContext';
}

const defaultConfigs: Config = {
  message: null,
  error: null,
};

const NotificationProvider: FC = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<Config>(defaultConfigs);

  const handleClose = (_event: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setConfig(defaultConfigs);
  };

  const setNotification = useCallback((config: PickUnion<Config>) => {
    setConfig((state) => ({
      ...state,
      ...config,
    }));
    setOpen(true);
  }, []);

  const { message, error, severity, onUndo } = config;

  const action = (
    <Fragment>
      {onUndo ? (
        <Button variant="text" onClick={onUndo}>
          Undo
        </Button>
      ) : null}
      <IconButton sx={{ ml: 0.5 }} color="inherit" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Fragment>
  );

  const content =
    error || (message && severity) ? (
      <AlertMessage
        onClose={handleClose}
        severity={error ? 'error' : severity}
        sx={{ width: '100%' }}
      >
        {error || message}
      </AlertMessage>
    ) : undefined;

  return (
    <NotificationContext.Provider value={setNotification}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={action}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {content}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export { NotificationContext as default, NotificationProvider };

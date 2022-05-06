import type { ContextValue } from 'contexts/NotificationContext';
import { NotificationContext } from 'contexts/NotificationContext';
import { useContext } from 'react';

const useNotification = (): ContextValue => {
  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) {
    throw new Error('Forgot to wrap component in NotificationProvider');
  }

  return notificationContext;
};

export default useNotification;

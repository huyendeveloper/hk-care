import type { AuthContextValue } from 'contexts/AuthContext';
import AuthContext from 'contexts/AuthContext';
import { useContext } from 'react';

const useAuth = (): AuthContextValue => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('Forgot to wrap component in AuthContext');
  }

  return authContext;
};

export default useAuth;

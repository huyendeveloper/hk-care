import SplashScreen from 'components/common/SplashScreen';
import useForceUpdate from 'hooks/useForceUpdate';
import { createContext, FC, useEffect, useState } from 'react';
import {
  apiLogin,
  getUserDetails,
  LoginParams,
  LoginResponse
} from 'services/auth';
import { UserInfo } from 'types/user';
import LocalStorage from 'utils/LocalStorage';
interface State {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}
export interface AuthContextValue extends State {
  login: (data: LoginParams) => Promise<LoginResponse>;
  logout: () => void;
  onForceUpdate: () => void;
}

const initialAuthState: State = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  AuthContext.displayName = 'AuthContext';
}

const AuthProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialAuthState);
  const [rerender, forceUpdate] = useForceUpdate();

  const login = async (params: LoginParams) => {
    const { username, password } = params;

    //call api to get accessToken, refreshToken
    const res = await apiLogin({
      username,
      password,
    });

    if (res.success && res.accessToken) {
      const { accessToken, refreshToken } = res;
      LocalStorage.set('accessToken', accessToken, forceUpdate);
      LocalStorage.set('refreshToken', refreshToken);
    }

    return res;
  };

  const logout = () => {
    LocalStorage.remove('accessToken', forceUpdate);
    LocalStorage.remove('refreshToken');
  };

  //get user from accessToken
  useEffect(() => {
    const onAuthStateChanged = async () => {
      try {
        const accessToken = LocalStorage.get('accessToken');
        if (accessToken) {
          const { data } = await getUserDetails();
          setState({
            user: data,
            isAuthenticated: true,
            isInitialized: true,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.log(error);
        setState({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
    };

    onAuthStateChanged();
  }, [rerender]);

  if (!state.isInitialized) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        onForceUpdate: forceUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext as default, AuthProvider };


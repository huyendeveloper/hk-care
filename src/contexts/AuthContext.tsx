import SplashScreen from 'components/common/SplashScreen';
import useForceUpdate from 'hooks/useForceUpdate';
import { createContext, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRoles } from 'redux/slices';
import { RootState } from 'redux/store';
import userService from 'services/user.service';
import { UserInfo } from 'types/user';
import LocalStorage from 'utils/LocalStorage';

interface State {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}
export interface AuthContextValue extends State {
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
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const logout = () => {
    LocalStorage.remove('accessToken');
  };

  //get user from accessToken
  useEffect(() => {
    const onAuthStateChanged = async () => {
      try {
        const accessToken = LocalStorage.get('accessToken');

        if (accessToken && auth.userId) {
          const { data } = await userService.getRoles(auth.userId);

          dispatch(updateRoles(data));

          setState({
            user: {
              firstName: 'John',
              lastName: 'Smith',
              userName: 'johndoe',
              fullName: 'John Smith',
              image: null,
              userRole: data,
            },
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
        setState({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
    };

    onAuthStateChanged();
  }, [rerender]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        onForceUpdate: forceUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext as default, AuthProvider };

import CssBaseline from '@mui/material/CssBaseline';
import GlobalBaseStyles from 'components/common/GlobalBaseStyles';
import SplashScreen from 'components/common/SplashScreen';
import { NotificationProvider } from 'contexts/NotificationContext';
import { createContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import './App.css';
import Router from './routers';

function App() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <NotificationProvider>
      {/* {!auth.isInitialized && <SplashScreen />} */}
      <CssBaseline />
      <GlobalBaseStyles />
      <Router />
    </NotificationProvider>
  );
}

export default App;

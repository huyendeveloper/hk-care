import CssBaseline from '@mui/material/CssBaseline';
import GlobalBaseStyles from 'components/common/GlobalBaseStyles';
import { NotificationProvider } from 'contexts/NotificationContext';
import './App.css';
import Router from './routers';

function App() {

  return (
    <NotificationProvider>
      <CssBaseline />
      <GlobalBaseStyles />
      <Router />
    </NotificationProvider>
  );
}

export default App;

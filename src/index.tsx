import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from 'redux/store';
import { createTheme } from 'theme';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { register as registerServiceWorker } from './serviceWorkerRegistration';

import vi from 'date-fns/locale/vi';
import DateFnsUtils from '@date-io/date-fns';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HelmetProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
            <ThemeProvider theme={createTheme()}>
              {/* <AuthProvider> */}
              <BrowserRouter>
                <App />
              </BrowserRouter>
              {/* </AuthProvider> */}
            </ThemeProvider>
          </LocalizationProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

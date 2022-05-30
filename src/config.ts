const baseURL =
  process.env.REACT_APP_BASE_URL || 'http://210.245.85.229:1997/api';

const connectURL = process.env.REACT_APP_API_URL;

const version = process.env.REACT_APP_VERSION;

export { baseURL, connectURL, version };

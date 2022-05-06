const baseURL = process.env.REACT_APP_BASE_URL
  ? process.env.REACT_APP_BASE_URL
  : 'http://localhost:3000';

const version = process.env.REACT_APP_VERSION;

export { baseURL, version };

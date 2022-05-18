import store from 'redux/store';

export default function authHeader() {
  const access_Token = 'store.getState().auth.accessToken';

  if (access_Token) {
    return { Authorization: `Bearer ${access_Token}` };
  } else {
    return {};
  }
}

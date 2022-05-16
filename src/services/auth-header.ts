import LocalStorage from 'utils/LocalStorage';

export default function authHeader() {
  const access_Token = LocalStorage.get('access_Token');

  if (access_Token) {
    return { Authorization: `Bearer ${access_Token}` };
  } else {
    return {};
  }
}

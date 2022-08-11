import axios from 'axios';
import { connectURL } from 'config';

class AuthService {
  connectToken(body) {
    const params = new URLSearchParams();
    params.append('username', body.username.toString().trim());
    params.append('password', body.password.toString().trim());
    params.append('client_id', 'Care_App');
    params.append('client_secret', '1q2w3e*');
    params.append('grant_type', 'password');
    body.__tenant && params.append('__tenant', body.__tenant);
    return axios.post(`${connectURL}/connect/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
}
export default new AuthService();

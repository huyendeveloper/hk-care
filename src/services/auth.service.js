import axios from 'axios';

class AuthService {
  login(body) {
    const params = new URLSearchParams();
    params.append('username', body.username.toString());
    params.append('password', body.password.toString());
    params.append('client_id', 'Care_App');
    params.append('client_secret', '1q2w3e*');
    params.append('grant_type', 'password');
    params.append('__tenant', body.__tenant);
    return axios.post('https://192.168.1.15:44327/connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
}
export default new AuthService();

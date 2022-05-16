import axios from 'axios';
import { baseURL } from 'config';

class AuthService {
  login(body) {
    return axios.post(`${baseURL}/app/account/login`, body);
  }
}
export default new AuthService();

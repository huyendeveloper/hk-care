import axios, { AxiosRequestHeaders } from 'axios';
import { baseURL } from 'config';
import authHeader from './auth-header';

class UserService {
  getRoles(id: string) {
    return axios.get(`${baseURL}/identity/roles/GetRoleByUser?userId=${id}`, {
      headers: authHeader() as AxiosRequestHeaders,
    });
  }
}
export default new UserService();

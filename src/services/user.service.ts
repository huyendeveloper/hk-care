import axiosClient from 'api';
import { baseURL } from 'config';

class UserService {
  getRoles() {
    return axiosClient.get(`${baseURL}/identity/roles/GetRoleCurrent`);
  }
}

export default new UserService();

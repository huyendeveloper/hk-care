import axiosClient from 'api';
import { connectURL } from 'config';

class UserService {
  getRoles() {
    return axiosClient.get(`${connectURL}/api/identity/roles/GetRoleCurrent`);
  }
}

export default new UserService();

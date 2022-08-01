import axiosClient from 'api';
import { connectURL } from 'config';

class UserService {
  getRoleCurrent() {
    return axiosClient.get(`${connectURL}/api/identity/roles/GetRoleCurrent`);
  }
}

export default new UserService();

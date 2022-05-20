import axiosClient from 'api';
import { baseURL } from 'config';

class TenantService {
  getAll() {
    return axiosClient.get(`${baseURL}/app/GetTenants`);
  }
}

export default new TenantService();

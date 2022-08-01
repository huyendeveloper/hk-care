import axiosClient from 'api';
import { baseURL } from 'config';

class TenantService {
  getTenants() {
    return axiosClient.get(`${baseURL}/GetTenants`);
  }
}

export default new TenantService();

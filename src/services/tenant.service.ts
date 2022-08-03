import axiosClient from 'api';
import { baseURL } from 'config';

class TenantService {
  getTenants() {
    return axiosClient.get(`${baseURL}/GetTenants`);
  }

  changeStatus(id: number | null) {
    return axiosClient.put(`${baseURL}/salepoint/changestatus/${id}`);
  }
}

export default new TenantService();

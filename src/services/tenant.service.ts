import axiosClient from 'api';
import { baseURL } from 'config';

class TenantService {
  getTenants() {
    return axiosClient.get(`${baseURL}/GetTenants`);
  }

  changeStatus(id: number | null) {
    return axiosClient.put(`${baseURL}/salepoint/changestatus/${id}`);
  }

  getTenantIsActives() {
    return axiosClient.get(`${baseURL}/exportWH/GetTenantIsActives`);
  }
}

export default new TenantService();

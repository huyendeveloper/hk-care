import axiosClient from 'api';
import axios from 'axios';
import { baseURL, connectURL } from 'config';
import { FilterParams } from 'types/common';
import LocalStorage from 'utils/LocalStorage';
import { PagedResultDto } from 'views/HK_Group/Tenant/dto/pagedResultDto';
import {
  AttachmentsFile,
  SalePointDto,
  SalePointOutDto,
} from 'views/HK_Group/Tenant/dto/salePointDto';

interface IAccount {
  name: string;
  adminEmailAddress: string;
  adminPassword: string;
}

class SalePointService {
  public async upload(file: any) {
    try {
      const token = LocalStorage.get('accessToken');

      const params = new FormData();

      if (file) {
        params.append('file', file);
      }

      return axios({
        method: 'post',
        url: `${baseURL}/SalePoint/upload-image`,
        data: params,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  public async createAccount(body: IAccount) {
    return axiosClient.post(`${connectURL}/api/multi-tenancy/tenants`, {
      name: body.name,
      adminEmailAddress: body.adminEmailAddress,
      adminPassword: body.adminPassword,
    });
  }

  public async updateMoreInfo(body: IAccount, id: string) {
    return axiosClient.put(`${baseURL}/SalePoint/UpdateSalePointAsync`, body);
  }

  public async create(input: SalePointDto | undefined) {
    return axiosClient.post(`${baseURL}/SalePoint/CreateSalePointAsync`, input);
  }

  public async update(id: string | undefined, input: SalePointDto | undefined) {
    return axiosClient.put(`${baseURL}/SalePoint/UpdateSalePointAsync`, input);
  }

  public async search(
    input: FilterParams
  ): Promise<PagedResultDto<SalePointOutDto>> {
    let rs = await axiosClient.get(`${baseURL}/salepoint/search`, {
      params: {
        SkipCount: (input.pageIndex - 1) * input.pageSize,
        MaxResultCount: input.pageSize,
        Keyword: input.searchText,
      },
    });
    if (rs) {
      return rs.data;
    } else {
      return rs;
    }
  }

  public async detail(id: string | null | undefined): Promise<SalePointOutDto> {
    let rs = await axiosClient.get(`${baseURL}/SalePoint/Detail/${id}`);
    if (rs) {
      return rs.data;
    } else {
      return rs;
    }
  }

  public async delete(id: string | null | undefined) {
    let rs = await axiosClient.delete(`${baseURL}/salepoint/delete/${id}`);
    if (rs) {
      return rs.data;
    } else {
      return rs;
    }
  }
}
export default new SalePointService();

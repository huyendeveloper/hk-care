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
    const { adminEmailAddress, adminPassword, ...res } = body;
    return axiosClient.put(`${baseURL}/SalePoint/UpdateMoreInfo/${id}`, {
      ...res,
      id,
    });
  }

  public async create(input: SalePointDto | undefined) {
    const params = new FormData();
    input?.name && params.append('name', input.name.toString());
    input?.address && params.append('address', input.address.toString());
    input?.hotline && params.append('hotline', input.hotline.toString());
    input?.isActived && params.append('isActived', input.isActived.toString());
    input?.nameContact &&
      params.append('nameContact', input.nameContact.toString());
    input?.phone && params.append('phone', input.phone.toString());
    input?.description &&
      params.append('description', input.description.toString());
    input?.adminEmailAddress &&
      params.append('adminEmailAddress', input.adminEmailAddress.toString());
    input?.adminPassword &&
      params.append('adminPassword', input.adminPassword.toString());

    if (input?.attachments) {
      input?.attachments.forEach((m: AttachmentsFile, index) => {
        if (m) {
          params.append(`attachments[${index}].name`, m.name);
          params.append(`attachments[${index}].url`, m.url);
        }
      });
    } else {
      params.append(`attachments`, ''.toString());
    }

    const token = LocalStorage.get('accessToken');

    return axios({
      method: 'post',
      url: `${baseURL}/SalePoint/Create`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async update(id: string | undefined, input: SalePointDto | undefined) {
    const params = new FormData();
    input?.name && params.append('name', input.name.toString());
    input?.address && params.append('address', input.address.toString());
    input?.hotline && params.append('hotline', input.hotline.toString());
    input?.isActived && params.append('isActived', input.isActived.toString());
    input?.nameContact &&
      params.append('nameContact', input.nameContact.toString());
    input?.phone && params.append('phone', input.phone.toString());
    input?.description &&
      params.append('description', input.description.toString());
    input?.adminEmailAddress &&
      params.append('adminEmailAddress', input.adminEmailAddress.toString());
    input?.adminPassword &&
      params.append('adminPassword', input.adminPassword.toString());

    if (input?.attachments) {
      input?.attachments.forEach((m, index) => {
        if (m) {
          params.append(`attachments[${index}].name`, m.name);
          params.append(`attachments[${index}].url`, m.url);
        }
      });
    }

    const token = LocalStorage.get('accessToken');

    return axios({
      method: 'put',
      url: `${baseURL}/SalePoint/Update/${id}`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
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
    let rs = await axiosClient.get(`${baseURL}/salepoint/detail/${id}`);
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

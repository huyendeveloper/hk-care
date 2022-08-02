import axiosClient from 'api';
import axios from 'axios';
import { baseURL } from 'config';
import { FilterParams } from 'types/common';
import LocalStorage from 'utils/LocalStorage';
import { PagedResultDto } from './dto/pagedResultDto';
import { SalePointDto, SalePointOutDto } from './dto/salePointDto';

class TenantService {
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

    if (input?.attachments) {
      input?.attachments.forEach((m, index) => {
        if (m.file) {
          params.append(`attachments[${index}].file`, m.file);
          params.append(`attachments[${index}].url`, '');
        } else {
          params.append(`attachments[${index}].file`, '');
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

    if (input?.attachments) {
      input?.attachments.forEach((m, index) => {
        if (m.file) {
          params.append(`attachments[${index}].file`, m.file);
          params.append(`attachments[${index}].url`, '');
        } else {
          params.append(`attachments[${index}].file`, '');
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
export default new TenantService();

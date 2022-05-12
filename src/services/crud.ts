import { mockCRUDList, mockDangDungList } from 'mock-axios';
import { CommonResponse, FilterParams } from 'types/common';
import HttpClient, { mock } from 'utils/HttpClient';
import LocalStorage from 'utils/LocalStorage';
import { DangDung } from 'views/HK_Group/SanPham/Loai/DangDung/type';

export interface ExampleCRUD {
  id: number;
  textField: string;
  selectField: number;
  mutipleSelectField: number[];
  radioField: number;
  switchField: boolean;
  date: string;
  time: string;
  image: string;
}

export const getListExampleCRUD = async (params: FilterParams) => {
  //Start Mock
  const mockCRUD = LocalStorage.get('mockCRUD');
  if (!mockCRUD) {
    LocalStorage.set('mockCRUD', JSON.stringify(mockCRUDList));
  }
  const mockResponse: CommonResponse<ExampleCRUD[]> = JSON.parse(
    LocalStorage.get('mockCRUD')
  ) || {
    data: [],
    total: 0,
  };

  const { pageIndex, pageSize } = params;

  mock.onPost('/Example/CRUD/ListCRUD').reply(200, {
    data: mockResponse.data?.splice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    ),
    total: mockResponse.total,
  });
  //End Mock

  return HttpClient.post<typeof params, CommonResponse<ExampleCRUD[]>>(
    '/Example/CRUD/ListCRUD',
    params
  );
};

export const getListDangDung = async (params: FilterParams) => {
  //Start Mock
  const mockDangDung = LocalStorage.get('mockDangDung');
  if (!mockDangDung) {
    LocalStorage.set('mockDangDung', JSON.stringify(mockDangDungList));
  }
  const mockResponse: CommonResponse<DangDung[]> = JSON.parse(
    LocalStorage.get('mockDangDung')
  ) || {
    data: [],
    total: 0,
  };

  const { pageIndex, pageSize } = params;

  mock.onPost('/hk_group/san_pham/loai/dang_dung').reply(200, {
    data: mockResponse.data?.splice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    ),
    total: mockResponse.total,
  });
  //End Mock

  return HttpClient.post<typeof params, CommonResponse<DangDung[]>>(
    '/hk_group/san_pham/loai/dang_dung',
    params
  );
};

export const getDangDungDetails = async (id: string) => {
  //start mock
  const mockDangDungString = LocalStorage.get('mockDangDung');

  const mockDangDungObject: CommonResponse<DangDung[]> =
    JSON.parse(mockDangDungString);

  const mockList = mockDangDungObject.data ?? [];

  const mockDetails = mockList.find((crud) => crud.id === +id);

  mock.onGet(`/hk_group/san_pham/loai/dang_dung/${id}`).reply(200, {
    data: mockDetails ?? null,
    success: true,
  });
  //end mock

  return HttpClient.get<string, CommonResponse>(
    `/hk_group/san_pham/loai/dang_dung/${id}`
  );
};

export const deleteExampleCRUD = async (id: number) => {
  //start mock
  const mockCRUDString = LocalStorage.get('mockCRUD');

  const mockCRUDResponse: CommonResponse<ExampleCRUD[]> =
    JSON.parse(mockCRUDString);

  const mockList = mockCRUDResponse.data ?? [];

  const newList = mockList.filter((crud) => crud.id !== id);

  LocalStorage.set(
    'mockCRUD',
    JSON.stringify({
      data: newList,
      total: mockCRUDResponse.total - 1,
    })
  );

  mock.onDelete(`/Example/CRUD/Delete?id=${id}`).reply(200, {
    success: true,
  });
  //end mock

  return HttpClient.delete<number, CommonResponse<ExampleCRUD[]>>(
    `/Example/CRUD/Delete?id=${id}`
  );
};

interface CreateParams {
  id: number;
  textField: string;
  selectField: number;
  mutipleSelectField: number[];
  radioField: number;
  switchField: boolean;
  date: string;
  time: string;
  image: string;
}

export const createExampleCRUD = async (params: CreateParams) => {
  //start mock
  const mockCRUDString = LocalStorage.get('mockCRUD');

  const mockCRUDObject: CommonResponse<ExampleCRUD[]> =
    JSON.parse(mockCRUDString);

  const crudList = mockCRUDObject.data ?? [];

  const newCRUD: ExampleCRUD = params;

  const newList = [...crudList, newCRUD];

  LocalStorage.set(
    'mockCRUD',
    JSON.stringify({
      data: newList,
      total: newList.length,
    })
  );

  mock.onPost('/Example/CRUD/Create').reply(200, {
    success: true,
  });
  //end mock

  return HttpClient.post<typeof params, CommonResponse>(
    '/Example/CRUD/Create',
    params
  );
};

export const getCRUDDetails = async (id: string) => {
  //start mock
  const mockCRUDString = LocalStorage.get('mockCRUD');

  const mockCRUDObject: CommonResponse<ExampleCRUD[]> =
    JSON.parse(mockCRUDString);

  const mockList = mockCRUDObject.data ?? [];

  const mockDetails = mockList.find((crud) => crud.id === +id);

  mock.onGet(`/Example/CRUD/Detail?id=${id}`).reply(200, {
    data: mockDetails ?? null,
    success: true,
  });
  //end mock

  return HttpClient.get<string, CommonResponse>(
    `/Example/CRUD/Detail?id=${id}`
  );
};

export const editExampleCRUD = async (params: CreateParams) => {
  //start mock
  const mockCRUDString = LocalStorage.get('mockCRUD');

  const mockCRUDObject: CommonResponse<ExampleCRUD[]> =
    JSON.parse(mockCRUDString);

  const mockList = mockCRUDObject.data ?? [];

  const newList = mockList.filter((crud) => crud.id !== params.id);

  LocalStorage.set(
    'mockCRUD',
    JSON.stringify({
      data: [...newList, params],
      total: mockCRUDObject.total,
    })
  );

  mock.onPut('/Example/CRUD/Edit').reply(200, {
    success: true,
  });
  //end mock

  return HttpClient.put<CreateParams, CommonResponse>('/Example/CRUD/Edit');
};

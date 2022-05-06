import { CommonResponse } from 'types/common';
import { UserInfo } from 'types/user';
import HttpClient, { mock } from 'utils/HttpClient';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  success: boolean;
}

export const apiLogin = async (params: LoginParams) => {
  mock.onPost('/Login').reply(200, {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsInVuaXF1ZV9uYW1lIjoiMTEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJuaGFudEBnbWFpbC5jb20iLCJuYW1lIjoiTmjDoyBKaWthIGFoaWhpIEpvY2t5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTG9jYXRpb24gQWRtaW5pc3RyYXRvciIsIlBlcm1pc3Npb25zIjoiW1widmVoaWNsZS5kZWxldGVcIixcInZlaGljbGUudXBkYXRlXCIsXCJ2ZWhpY2xlLmNyZWF0ZVwiLFwidmVoaWNsZS5yZWFkXCIsXCJsb2FkLmRlbGV0ZVwiLFwibG9hZC51cGRhdGVcIixcImxvYWQuY3JlYXRlXCIsXCJsb2FkLnJlYWRcIixcInRlbmRlci5iaWRcIixcInRlbmRlci5jb25maXJtYXRpb25cIixcImNvbnRhY3QucmVhZFwiLFwidGVuZGVyLnNlbGVjdE9mZmVyXCIsXCJ0ZW5kZXIudXBkYXRlXCIsXCJ0ZW5kZXIuY3JlYXRlXCIsXCJ0ZW5kZXIucmVhZFwiLFwiZG9jdW1lbnQucmVhZFwiLFwidGVuZGVyLndpdGhkcmF3XCIsXCJjb250YWN0LmNyZWF0ZVwiLFwiY29tcGFueS5yZWFkXCIsXCJjb250YWN0LnVwZGF0ZVwiLFwiZW1wbG95ZWUuZGVsZXRlXCIsXCJlbXBsb3llZS5jcmVhdGVcIixcImVtcGxveWVlLnJlYWRcIixcImxvY2F0aW9uLnVwZGF0ZVwiLFwibG9jYXRpb24ucmVhZFwiLFwiYWRkcmVzcy51cGRhdGVcIixcImFkZHJlc3MuY3JlYXRlXCIsXCJhZGRyZXNzLnJlYWRcIixcImVtcGxveWVlLnVwZGF0ZVwiLFwidGVybS5yZWFkXCIsXCJwZXJzb25hbFByb2ZpbGUudXBkYXRlXCIsXCJwZXJzb25hbFByb2ZpbGUucmVhZFwiXSIsIkNvbXBhbnlJZCI6IjUiLCJqdGkiOiJlM2MxNzEwMi1jYTM0LTQ1MzctYTk1Yi1mNmU0ZWZiMjEwMmMiLCJpYXQiOjE2NDczMzk1MTYsIm5iZiI6MTY0NzMzOTUxNiwiZXhwIjoxNjQ3NDI1OTE2fQ.VVjIO1a1GveduJt7DRKdxMoyk-Iu_7nSoXZZmij_Bt0', // fake
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsInVuaXF1ZV9uYW1lIjoiMTEiLCJqdGkiOiIyYjI3Y2U4Mi0xYTY4LTQwMTEtODU2Mi1kYTM1MjZmNzEzZmQiLCJpYXQiOjE2NDczMzk1MTYsIm5iZiI6MTY0NzMzOTUxNiwiZXhwIjoxNjQ3OTg3NTE2fQ.o7Yfi6tW5Oboe6nk0Pn8Y8Sjn1V8TKHOtY-_BcSpuWA',
    success: true,
  });

  return HttpClient.post<typeof params, LoginResponse>('/Login', params);
};

export const getUserDetails = async () => {
  mock.onGet('/Shared/User/GetUserDetails').reply(200, {
    data: {
      firstName: 'John',
      lastName: 'Smith',
      userName: 'johndoe',
      fullName: 'John Smith',
      image: null,
      userRole: {
        id: 1,
        name: 'Admin',
        code: 'admin',
      },
    },
  });

  return HttpClient.get<null, CommonResponse<UserInfo>>(
    '/Shared/User/GetUserDetails'
  );
};

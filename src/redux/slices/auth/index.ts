import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILogin } from 'interface';
import authService from 'services/auth.service';
import userService from 'services/user.service';
import { UserInfo } from 'types';
import LocalStorage from 'utils/LocalStorage';

interface IInitialState {
  userRoles: string[];
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
}

const initialState: IInitialState = {
  userRoles: [],
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (body: ILogin, { rejectWithValue }) => {
    try {
      const res = await authService.login(body);

      if (res.data.access_token) {
        const access_Token = res.data.access_token as string;
        LocalStorage.set('accessToken', access_Token);
        LocalStorage.set('tennant', body.tenant || '');
        const { data } = await userService.getRoles();

        return {
          access_Token,
          userRoles: data,
        };
      }

      return rejectWithValue('Login fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateRoles: (state, action: PayloadAction<string[]>) => {
      state.userRoles = action.payload;
    },
    logout: (state) => {
      LocalStorage.remove('accessToken');
      state.isAuthenticated = false;
      state.userRoles = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      login.fulfilled,
      (
        state,
        action: PayloadAction<{
          access_Token: string;
          userRoles: string[];
        }>
      ) => {
        const userRoles = action.payload.userRoles;
        state.userRoles = userRoles;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.loading = false;
      }
    );

    builder.addCase(login.rejected, (state) => {
      state.isInitialized = true;
      state.loading = false;
    });
  },
});

export const { updateRoles, logout } = authSlice.actions;
export default authSlice.reducer;

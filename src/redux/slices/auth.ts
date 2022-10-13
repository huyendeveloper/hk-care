import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILogin } from 'interface';
import moment from 'moment';
import authService from 'services/auth.service';
import userService from 'services/user.service';
import { Role, UserInfo } from 'types';
import LocalStorage from 'utils/LocalStorage';

interface IInitialState {
  userRoles: Role[];
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  lastLogin: string | null;
}

const initialState: IInitialState = {
  userRoles: [],
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  lastLogin: null,
};

export const connectToken = createAsyncThunk(
  'auth/connectToken',
  async (body: ILogin, { rejectWithValue }) => {
    try {
      const res = await authService.connectToken(body);

      if (res.data.access_token) {
        const access_Token = res.data.access_token as string;
        LocalStorage.set('accessToken', access_Token);
        LocalStorage.set('tennant', body.tenant || '');
        const { data } = await userService.getRoleCurrent();

        return {
          access_Token,
          userRoles: data,
        };
      }

      return rejectWithValue('Error');
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
      state.userRoles = action.payload as Role[];
    },
    logout: (state) => {
      LocalStorage.remove('accessToken');
      state.isAuthenticated = false;
      state.userRoles = [];
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectToken.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      connectToken.fulfilled,
      (
        state,
        action: PayloadAction<{
          access_Token: string;
          userRoles: string[];
        }>
      ) => {
        const userRoles = action.payload.userRoles;
        state.userRoles = userRoles as Role[];
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.loading = false;
        state.lastLogin = moment().format('yyyy-MM-DD');
      }
    );

    builder.addCase(connectToken.rejected, (state) => {
      state.isInitialized = true;
      state.loading = false;
    });
  },
});

export const { updateRoles, logout, resetLoading } = authSlice.actions;
export default authSlice.reducer;

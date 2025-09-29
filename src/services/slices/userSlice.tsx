import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser, TOrder } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  getOrdersApi
} from '@api';
import { setCookie, deleteCookie } from '@utils-cookie';

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  ({ email, password }: { email: string; password: string }) =>
    loginUserApi({ email, password })
);

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  ({
    email,
    name,
    password
  }: {
    email: string;
    name: string;
    password: string;
  }) => registerUserApi({ email, name, password })
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (userData: { name: string; email: string; password?: string }) =>
    await updateUserApi(userData)
);

export const logoutUserThunk = createAsyncThunk('users/logoutUser', () =>
  logoutApi()
);

export const getUserOrdersThunk = createAsyncThunk('users/getOrders', () =>
  getOrdersApi()
);

export const getUserThunk = createAsyncThunk('users/getUser', () =>
  getUserApi()
);

export type TUserState = {
  isAuth: boolean;
  isLoading: boolean;
  isOrdersLoading: boolean;
  user: TUser | null;
  authChecked: boolean;
  error: string | null;
  orders: TOrder[];
};

const initialState: TUserState = {
  isAuth: false,
  isLoading: false,
  isOrdersLoading: false,
  authChecked: false,
  user: null,
  error: null,
  orders: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      setCookie('accessToken', action.payload.accessToken);
    });
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка регистрации';
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    });
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка обновления профиля';
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });

    builder.addCase(logoutUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка выхода из профиля';
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    });
    builder.addCase(getUserOrdersThunk.pending, (state) => {
      state.isOrdersLoading = true;
    });
    builder.addCase(getUserOrdersThunk.rejected, (state, action) => {
      state.isOrdersLoading = false;
      state.error = action.error.message || 'Ошибка загрузки заказов';
    });
    builder.addCase(getUserOrdersThunk.fulfilled, (state, action) => {
      state.isOrdersLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.user = action.payload.user;
      state.error = null;
      state.authChecked = true;
    });

    builder.addCase(getUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = null;
      state.authChecked = true;
    });
  }
});

export default userSlice.reducer;

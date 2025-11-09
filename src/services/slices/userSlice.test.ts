import { describe, expect, test } from '@jest/globals';
import userReducer, { TUserState, loginUserThunk, getUserThunk } from './userSlice';
import { TUser } from '@utils-types';

describe('userSlice reducer', () => {
  const initialState: TUserState = {
    isAuth: false,
    isLoading: false,
    isOrdersLoading: false,
    authChecked: false,
    user: null,
    error: null,
    orders: []
  };

  const mockUser: TUser = {
    name: 'Иван',
    email: 'ivan@example.com'
  };

  const fakeArg = { email: 'test@test.com', password: '123456' };

  test('loginUserThunk.pending: isLoading = true', () => {
    const nextState = userReducer(initialState, loginUserThunk.pending('', fakeArg));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('loginUserThunk.fulfilled: сохраняем user, isLoading = false, isAuth = true', () => {
    const nextState = userReducer(
      initialState,
      loginUserThunk.fulfilled({ success: true, user: mockUser, accessToken: '', refreshToken: '' }, '', fakeArg)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.isAuth).toBe(true);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.error).toBeNull();
  });

  test('loginUserThunk.rejected: isLoading = false, error присваивается', () => {
    const nextState = userReducer(
      initialState,
      loginUserThunk.rejected(new Error('Ошибка авторизации'), '', fakeArg)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('getUserThunk.pending: isLoading = true', () => {
    const nextState = userReducer(initialState, getUserThunk.pending('', undefined));
    expect(nextState.isLoading).toBe(true);
  });

  test('getUserThunk.fulfilled: user сохраняется, authChecked = true', () => {
    const nextState = userReducer(
      initialState,
      getUserThunk.fulfilled({ success: true, user: mockUser }, '', undefined)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.isAuth).toBe(true);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.authChecked).toBe(true);
  });

  test('getUserThunk.rejected: isLoading = false, authChecked = true', () => {
    const nextState = userReducer(initialState, getUserThunk.rejected(new Error('Ошибка'), '', undefined));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.isAuth).toBe(false);
    expect(nextState.authChecked).toBe(true);
    expect(nextState.user).toBeNull();
  });
});

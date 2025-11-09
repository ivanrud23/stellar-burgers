import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from '@slices/ingredientsSlice';
import constrSlice from '@slices/constrSlice';
import feedSlice from '@slices/feedSlice';
import userSlice from '@slices/userSlice';
import { describe, expect, test } from '@jest/globals';

const appReducer = combineReducers({
  ingredients: ingredientsSlice,
  constr: constrSlice,
  feed: feedSlice,
  user: userSlice
});

describe('Тесты на Jest', () => {
  test('Проверка инициализации', () => {
    const state = appReducer(undefined, { type: '' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constr');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');

    expect(state.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });

    expect(state.constr).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null
    });

    expect(state.feed).toEqual({
      ordersData: { orders: [], total: 0, totalToday: 0 },
      loading: false,
      error: null
    });

    expect(state.user).toEqual({
      isAuth: false,
      isLoading: false,
      isOrdersLoading: false,
      authChecked: false,
      user: null,
      error: null,
      orders: []
    });
  });
});

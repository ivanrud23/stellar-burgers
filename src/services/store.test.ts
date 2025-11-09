import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice, {
  initialState as ingredientsInitial
} from '@slices/ingredientsSlice';
import constrSlice, {
  initialState as constrInitial
} from '@slices/constrSlice';
import feedSlice, { initialState as feedInitial } from '@slices/feedSlice';
import userSlice, { initialState as userInitial } from '@slices/userSlice';
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

    expect(state.ingredients).toEqual(ingredientsInitial);
    expect(state.constr).toEqual(constrInitial);
    expect(state.feed).toEqual(feedInitial);
    expect(state.user).toEqual(userInitial);
  });
});

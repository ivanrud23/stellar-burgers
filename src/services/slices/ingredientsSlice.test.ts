import { describe, expect, test } from '@jest/globals';
import ingredientsReducer, { getIngredientsThunk, TIngredientsState } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  const initialState: TIngredientsState = {
    items: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 50,
      image: 'img.png',
      image_large: 'img_lg.png',
      image_mobile: 'img_sm.png'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 15,
      fat: 10,
      carbohydrates: 5,
      calories: 200,
      price: 80,
      image: 'img2.png',
      image_large: 'img2_lg.png',
      image_mobile: 'img2_sm.png'
    }
  ];

  test('pending: при вызове getIngredientsThunk.loading становится true', () => {
    const nextState = ingredientsReducer(initialState, getIngredientsThunk.pending('', undefined));
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('fulfilled: данные сохраняются в store, loading = false', () => {
    const nextState = ingredientsReducer(initialState, getIngredientsThunk.fulfilled(mockIngredients, '', undefined));
    expect(nextState.loading).toBe(false);
    expect(nextState.items).toEqual(mockIngredients);
    expect(nextState.error).toBeNull();
  });

  test('rejected: ошибка сохраняется, loading = false', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const nextState = ingredientsReducer(initialState, getIngredientsThunk.rejected(
  new Error(errorMessage),
  '', // requestId
  undefined
));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });
});

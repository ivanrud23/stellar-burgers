import { describe, expect, test } from '@jest/globals';
import constrReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constrSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { TConstState } from './constrSlice';

describe('constrSlice reducer', () => {
  const initialState: TConstState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  const mockIngredient: TIngredient = {
    _id: '123',
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
  };

  test('должен добавить ингредиент (булку)', () => {
    const nextState = constrReducer(initialState, addIngredient(mockIngredient));
    expect(nextState.bun).toHaveProperty('_id', '123');
  });

  test('должен добавить ингредиент (начинку)', () => {
    const filling = { ...mockIngredient, _id: '456', type: 'main', name: 'Котлета' };
    const nextState = constrReducer(initialState, addIngredient(filling));
    expect(nextState.ingredients.length).toBe(1);
    expect(nextState.ingredients[0]).toHaveProperty('_id', '456');
  });

  test('должен удалить ингредиент по id', () => {
    const existingState: TConstState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, _id: '1', type: 'main', id: 'abc' },
        { ...mockIngredient, _id: '2', type: 'main', id: 'def' }
      ]
    };

    const nextState = constrReducer(existingState, removeIngredient('abc'));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('def');
  });

  test('должен изменить порядок ингредиентов', () => {
    const existingState: TConstState = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, id: 'a', name: 'Первый', type: 'main' },
        { ...mockIngredient, id: 'b', name: 'Второй', type: 'main' }
      ]
    };

    const nextState = constrReducer(existingState, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(nextState.ingredients[0].id).toBe('b');
    expect(nextState.ingredients[1].id).toBe('a');
  });
});

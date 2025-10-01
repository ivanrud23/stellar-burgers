import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState, AppDispatch } from '@store';
import { getFeedThunk } from './feedSlice';

export type TConstState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TConstState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export const postOrderThunk = createAsyncThunk<
  TOrder,
  void,
  { state: RootState }
>('constr/postOrder', async (_, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState().constr;
    const ingredientIds: string[] = [
      ...(state.bun ? [state.bun._id] : []),
      ...state.ingredients.map((item) => item._id)
    ];
    const response = await orderBurgerApi(ingredientIds);
    dispatch(getFeedThunk());

    return response.order;
  } catch (error) {
    console.error('[postOrderThunk] error:', error);
    return rejectWithValue(error);
  }
});

const constrSlice = createSlice({
  name: 'constr',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    setBun: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        state.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient }
      })
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const updated = [...state.ingredients];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      state.ingredients = updated;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrderThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(postOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.ingredients = [];
        state.bun = null;
      })
      .addCase(postOrderThunk.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const { addIngredient, removeIngredient, clearConstructor, setBun, moveIngredient } =
  constrSlice.actions;

export default constrSlice.reducer;

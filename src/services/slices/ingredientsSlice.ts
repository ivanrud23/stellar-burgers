import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  () => getIngredientsApi().then((data) => data)
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getIngredientsThunk.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error.message ??
          'Ошибка при загрузке данных') as string;
      });
  }
});

export default ingredientsSlice.reducer;

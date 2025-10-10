import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';
import { stat } from 'fs';

export type TFeedState = {
  ordersData: TOrdersData;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  ordersData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const getFeedThunk = createAsyncThunk<TOrdersData>('feed/getFeed', () =>
  getFeedsApi().then((data) => ({
    orders: data.orders,
    total: data.total,
    totalToday: data.totalToday
  }))
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFeedThunk.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.ordersData = action.payload;
        }
      )
      .addCase(getFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке фида';
      });
  }
});

export default feedSlice.reducer;

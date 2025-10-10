import { combineReducers, configureStore } from '@reduxjs/toolkit';

import ingredientsSlice from '@slices/ingredientsSlice';
import constrSlice from '@slices/constrSlice';
import feedSlice from '@slices/feedSlice';
import userSlice from '@slices/userSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const appReducer = combineReducers({
  ingredients: ingredientsSlice,
  constr: constrSlice,
  feed: feedSlice,
  user: userSlice
});

const store = configureStore({
  reducer: appReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

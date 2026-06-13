import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      feed: feedReducer,
    },
  });

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import languageReducer from './slices/language/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

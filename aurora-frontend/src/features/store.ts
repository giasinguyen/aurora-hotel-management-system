import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import languageReducer from "./slices/languageSlice";
import authReducer from "./slices/auth/authSlice";
import branchReducer from "./slices/branch/branchSlice";
import ragReducer from "./slices/ragSlice";
import shiftReducer from "./slices/shiftSlice";

const rootReducer = combineReducers({
  language: languageReducer,
  auth: authReducer,
  branch: branchReducer,
  rag: ragReducer,
  shift: shiftReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "branch"], // Persist auth and branch state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

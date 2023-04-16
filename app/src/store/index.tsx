// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import metaDataReducer from './slices/metadataSlice';

const store = configureStore({
  reducer: {
    metaDataInfo: metaDataReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import cartSlice from './slices/cartSlice';
import productsSlice from './slices/productsSlice';
import ordersSlice from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    products: productsSlice,
    orders: ordersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
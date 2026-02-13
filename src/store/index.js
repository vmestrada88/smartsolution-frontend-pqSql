import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clientsReducer from './clientsSlice';
import productsReducer from './productsSlice';
import tasksReducer from './tasksSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    products: productsReducer,
    tasks: tasksReducer,
    cart: cartReducer,
  },
});

export default store;

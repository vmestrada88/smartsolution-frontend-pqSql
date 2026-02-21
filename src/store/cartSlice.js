import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as shopService from '../services/shopService';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await shopService.fetchCart();
      return cart;
    } catch (error) {
      // If not authenticated (401), return empty cart instead of error
      if (error.message.includes('401')) {
        return [];
      }
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      // If payload is object with product, use it for offline mode
      if (typeof payload === 'object' && payload.product) {
        const { productId, product } = payload;
        if (!token) {
          // User not authenticated - add locally
          return {
            id: Date.now(),
            productId,
            product,
            quantity: 1,
          };
        }
        // User authenticated - send to API
        const cartItem = await shopService.addToCart(productId);
        return cartItem;
      }
      // Legacy support: just productId
      const cartItem = await shopService.addToCart(payload);
      return cartItem;
    } catch (error) {
      // If not authenticated (401), add locally with dummy data
      if (error.message.includes('401')) {
        return {
          id: Date.now(),
          productId: payload.productId || payload,
          quantity: 1,
        };
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const updatedItem = await shopService.updateCartItem(id, quantity);
      return updatedItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItem',
  async (id, { rejectWithValue }) => {
    try {
      await shopService.removeCartItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.productId === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: Date.now(), // temporary id
          productId: action.payload.id,
          product: action.payload,
          quantity: 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // Update local state with server response
        const existingItem = state.items.find(item => item.productId === action.payload.productId);
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export default cartSlice.reducer;
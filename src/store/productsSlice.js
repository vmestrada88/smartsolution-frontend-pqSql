import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts as fetchProductsService, createProduct, updateProduct, deleteProduct } from '../services/productsService';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await fetchProductsService();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error fetching products');
  }
});

export const createProductAsync = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    const data = await createProduct(productData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error creating product');
  }
});

export const updateProductAsync = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
  try {
    const data = await updateProduct(id, productData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error updating product');
  }
});

export const deleteProductAsync = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    await deleteProduct(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error deleting product');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

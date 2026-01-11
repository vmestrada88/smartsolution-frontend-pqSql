import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClients as fetchClientsService } from '../services/clientsService';

export const fetchClients = createAsyncThunk('clients/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await fetchClientsService();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error fetching clients');
  }
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectAllClients = (state) => state.clients.items;
export const selectClientsStatus = (state) => state.clients.status;
export default clientsSlice.reducer;

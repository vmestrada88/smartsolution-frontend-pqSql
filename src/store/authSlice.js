import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, extractError } from '../services';

const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await api.post('/login', { email, password });
    return res.data; // { token, user }
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err));
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

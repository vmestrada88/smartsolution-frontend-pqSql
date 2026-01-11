import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tasksAPI from '../services/tasksService';
import { createTask as createTaskAPI } from '../services/tasksService';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (params, thunkAPI) => {
  try {
    const data = await tasksAPI.fetchTasks(params);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error fetching tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (task, thunkAPI) => {
  try {
    // Ensure assignedTo is sent as array
    const payload = { ...task };
    if (payload.assignedTo && !Array.isArray(payload.assignedTo)) payload.assignedTo = [payload.assignedTo];
    const data = await createTaskAPI(payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error creating task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }, thunkAPI) => {
  try {
    const data = await tasksAPI.updateTask(id, updates);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error updating task');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    await tasksAPI.deleteTask(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Error deleting task');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || action.error.message; })

      .addCase(createTask.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(i => i.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  }
});

export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksStatus = (state) => state.tasks.status;
export default tasksSlice.reducer;

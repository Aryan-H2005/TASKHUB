import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../services/api';

const wrap = (fn) => async (arg, { rejectWithValue }) => {
  try {
    return await fn(arg);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
};

export const fetchTasks = createAsyncThunk('tasks/fetch', wrap(async (params = {}) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
  const { data } = await api.get('/tasks', { params: clean });
  return data;
}));

export const createTask = createAsyncThunk('tasks/create', wrap(async (body) => (await api.post('/tasks', body)).data));

export const updateTask = createAsyncThunk('tasks/update', wrap(async ({ id, ...body }) => (await api.put(`/tasks/${id}`, body)).data));

export const deleteTask = createAsyncThunk('tasks/delete', wrap(async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
}));

const slice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateTask.fulfilled, (s, a) => {
        s.items = s.items.map((t) => (t._id === a.payload._id ? a.payload : t));
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.items = s.items.filter((t) => t._id !== a.payload);
      });
  },
});

export default slice.reducer;

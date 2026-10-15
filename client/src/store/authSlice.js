import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../services/api';
import { loadAuth, saveAuth, clearAuth } from '../utils/storage';

const { token, user } = loadAuth();

const authThunk = (name, url, remember) =>
  createAsyncThunk(name, async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post(url, body);
      saveAuth(data, remember(body));
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });

export const loginUser = authThunk('auth/login', '/login', (b) => !!b.rememberMe);
export const registerUser = authThunk('auth/register', '/register', () => false);

const slice = createSlice({
  name: 'auth',
  initialState: { token, user, loading: false, error: null },
  reducers: {
    logout(state) {
      clearAuth();
      state.token = null;
      state.user = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    [loginUser, registerUser].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (s) => { s.loading = true; s.error = null; })
        .addCase(thunk.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.user = a.payload.user; })
        .addCase(thunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    });
  },
});

export const { logout, clearError } = slice.actions;
export default slice.reducer;

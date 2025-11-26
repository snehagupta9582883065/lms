
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;

const initialState = {
  token: initialToken,
  user: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Support both shapes: { token, user } || { user: { token } }
      const token = response.data.token || response.data.user?.token;
      const user = response.data.user || response.data;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', token);
      }
      return { token, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);

      // Extract token similarly and persist it
      const token = response.data.token || response.data.user?.token;
      const user = response.data.user || response.data;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', token);
      }
      // Return consistent shape
      return { token, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('jwtToken');
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Login Reducers ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.token = null;
        state.user = null;
      })
      // --- Register Reducers ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUserData } = authSlice.actions;
export default authSlice.reducer;
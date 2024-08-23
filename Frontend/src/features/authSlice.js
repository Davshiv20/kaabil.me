// src/slices/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserData } from '@api/authService';

// Async Thunk for Google Authentication
export const setUserData = createAsyncThunk(
  'auth/setUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await getUserData();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setUserData.fulfilled, (state, action) => {
        const user = action.payload.user
        state.status = 'succeeded';
        state.user = user
        state.isAuthenticated = true;
      })
      .addCase(setUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

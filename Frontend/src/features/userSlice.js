import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {updateUser} from '@api/userService';

// Async thunk to update a user
export const updateUserDetails = createAsyncThunk(
  'user/updateUserDetails',
  async ({userId, updateData}, {rejectWithValue}) => {
    try {
      const updatedUser = await updateUser(userId, updateData);
      return updatedUser[0];
    } catch (error) {
      return rejectWithValue(error.message || 'Error updating user');
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    email: '',
    role: '',
    phone_number: '',
    workspace: null,
    isLoggedIn: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      const {id, name, email, role, phone_number, workspace, isLoggedIn} =
        action.payload;
      if (id !== undefined) state.id = id;
      if (name !== undefined) state.name = name;
      if (email !== undefined) state.email = email;
      if (role !== undefined) state.role = role;
      if (phone_number !== undefined) state.phone_number = phone_number;
      if (workspace !== undefined) state.workspace = workspace;
      if (isLoggedIn !== undefined) state.isLoggedIn = isLoggedIn;
    },
    updateUserField: (state, action) => {
      const {field, value} = action.payload;
      state[field] = value;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        const {id, name, email, role, phone_number, workspace, isLoggedIn} =
          action.payload;

        state.status = 'succeeded';
        if (name !== undefined) state.name = name;
        if (email !== undefined) state.email = email;
        if (role !== undefined) state.role = role;
        if (phone_number !== undefined) state.phone_number = phone_number;
        if (workspace !== undefined) state.workspace = workspace;
        if (isLoggedIn !== undefined) state.isLoggedIn = isLoggedIn;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {setUser, updateUserField} = userSlice.actions;
export default userSlice.reducer;

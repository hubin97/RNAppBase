import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Storage } from '@/utils/storage';

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: Storage.getBoolean('isAuthenticated') ?? false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      Storage.setBoolean('isAuthenticated', action.payload);
    },
  },
});

export const { setAuthentication } = authSlice.actions;
export default authSlice.reducer; 
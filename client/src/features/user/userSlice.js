/**
 * User Profile Management Redux Slice
 * 
 * Handles user profile updates, password changes, address management,
 * and account deletion with comprehensive error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios';

/**
 * Async thunk to update user profile
 * Updates: name, email, phone, profilePicture
 */
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/api/users/profile', profileData);
      
      // Update localStorage user data
      const currentUser = JSON.parse(localStorage.getItem('buyzzie_user') ?? '{}');
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem('buyzzie_user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to change user password
 */
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to change password';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to fetch user addresses
 */
export const fetchUserAddresses = createAsyncThunk(
  'user/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users/addresses');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch addresses';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to add new address
 */
export const addUserAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/addresses', addressData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to update existing address
 */
export const updateUserAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/users/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to delete address
 */
export const deleteUserAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/users/addresses/${addressId}`);
      return { ...response.data, addressId };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to set default address
 */
export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/users/addresses/${addressId}/set-default`);
      return { ...response.data, addressId };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to set default address';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to delete user account
 * Also clears localStorage after successful deletion
 */
export const deleteUserAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/api/users/account');
      
      // Clear localStorage
      localStorage.removeItem('buyzzie_user');
      localStorage.removeItem('buyzzie_token');
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete account';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  profile: null,
  addresses: [],
  loading: false,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.profile = action.payload.user ?? action.payload;
        state.successMessage = action.payload.message ?? 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message ?? 'Password changed successfully';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.addresses = action.payload.addresses ?? [];
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Address
      .addCase(addUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.addresses.push(action.payload.address);
        state.successMessage = action.payload.message ?? 'Address added successfully';
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Address
      .addCase(updateUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.addresses.findIndex((a) => a.id === action.payload.address?.id);
        if (index !== -1) {
          state.addresses[index] = action.payload.address;
        }
        state.successMessage = action.payload.message ?? 'Address updated successfully';
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Address
      .addCase(deleteUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.addresses = state.addresses.filter((a) => a.id !== action.payload.addressId);
        state.successMessage = action.payload.message ?? 'Address deleted successfully';
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set Default Address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update all addresses to reflect new default
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === action.payload.addressId,
        }));
        state.successMessage = action.payload.message ?? 'Default address updated';
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.profile = null;
        state.addresses = [];
        state.successMessage = 'Account deleted successfully';
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProfile, clearError, clearSuccessMessage } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserAddresses = (state) => state.user.addresses ?? [];
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccessMessage = (state) => state.user.successMessage;

export default userSlice.reducer;

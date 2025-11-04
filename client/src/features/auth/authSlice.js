import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

export const signup = createAsyncThunk(
  "auth/signup",  
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("buyzzie_user")) || null,
  token: localStorage.getItem("buyzzie_token") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("buyzzie_user");
      localStorage.removeItem("buyzzie_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("buyzzie_token", action.payload.token);
        localStorage.setItem(
          "buyzzie_user",
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("buyzzie_token", action.payload.token);
        localStorage.setItem(
          "buyzzie_user",
          JSON.stringify(action.payload.user)
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload?.error || action.error?.message;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

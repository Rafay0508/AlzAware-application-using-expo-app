import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await fetch(
        // "http://localhost:3000/api/auth/register",
        "https://alzaware-backend.netlify.app/.netlify/functions/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await fetch(
        // "http://localhost:3000/api/auth/login",
        "https://alzaware-backend.netlify.app/.netlify/functions/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);
export const verifyToken = createAsyncThunk(
  "user/verifyToken",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error("No token found");
      }

      console.log(token);
      const response = await fetch(
        "https://alzaware-backend.netlify.app/.netlify/functions/api/auth/verifyToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: token,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      // Extract serializable data from response
      const responseData = await response.json();

      // Return only the necessary data in the action payload
      return responseData;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    initialState: {
      status: "idle",
      error: null,
      token: null,
      userData: null,
      isLoading: false, // Add this line
    },
  },
  reducers: {
    // Add any synchronous actions here if needed
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.isLoading = true; // Add this line
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false; // Add this line
        state.token = action.payload.token;
        state.userData = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false; // Add this line
        state.error = action.payload
          ? action.payload.message
          : "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.isLoading = true; // Add this line
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false; // Add this line
        state.token = action.payload.token;
        state.userData = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false; // Add this line
        state.error = action.payload ? action.payload.message : "Login failed";
      })
      .addCase(verifyToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.userData = action.payload.user;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? action.payload.message
          : "Token verification failed";
      });
  },
});

export const { setToken, setUserData } = userSlice.actions;

export default userSlice.reducer;

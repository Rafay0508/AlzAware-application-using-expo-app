// messageSlice.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function for handling API requests
const handleApiRequest = async (
  url,
  method,
  data,
  { getState, rejectWithValue }
) => {
  try {
    const state = getState();

    // const token = state.user.user; // Assuming your user slice has a token
    const token = await AsyncStorage.getItem("token");
    console.log(JSON.parse(token).token);
    const headers = {
      Authorization: `Bearer ${JSON.parse(token).token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return rejectWithValue({ message: "Request failed" });
  }
};

// Async Thunks for Message Creation and Fetching
export const createMessage = createAsyncThunk(
  "messages/create",
  async (messageData, { getState, rejectWithValue }) => {
    const {
      user: { token },
    } = getState(); // Assuming your user slice has a token

    return handleApiRequest(
      // "http://localhost:3000/api/message/createMessages",
      "https://alzaware-backend.netlify.app/.netlify/functions/api/message/createMessages",

      "POST",
      { ...messageData, token },
      { getState, rejectWithValue }
    );
  }
);
export const fetchAllMessages = createAsyncThunk(
  "messages/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    return handleApiRequest(
      // "http://localhost:3000/api/message/allMessages",
      "https://alzaware-backend.netlify.app/.netlify/functions/api/message/allMessages",
      "GET",
      null,
      {
        getState,
        rejectWithValue,
      }
    );
  }
);

// Message Slice
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    status: "idle",
    error: null,
    messages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the newly created message to the state
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? action.payload.message
          : "Message creation failed";
      })
      .addCase(fetchAllMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchAllMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? action.payload.message
          : "Fetch messages failed";
      });
  },
});

export default messageSlice.reducer;

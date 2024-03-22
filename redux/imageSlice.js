// Create a new file, e.g., imageSlice.js

import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "image",
  initialState: {
    predictionResult: null,
    isLoading: false,
  },
  reducers: {
    setPredictionResult: (state, action) => {
      state.predictionResult = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setPredictionResult, setLoading } = imageSlice.actions;

export default imageSlice.reducer;

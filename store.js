// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/userSlice";
import messagesReducer from "./redux/messageSlice";
import imageReducer from "./redux/imageSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messagesReducer,
    image: imageReducer,
  },
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messagesList: [],
  loading: false,
  error: null,
  response: null,
  currentMessage: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.messagesList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getMessageDetails: (state, action) => {
      state.currentMessage = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getMessageDetails,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;

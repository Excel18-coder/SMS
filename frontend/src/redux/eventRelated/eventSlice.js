import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventsList: [],
  loading: false,
  error: null,
  response: null,
  currentEvent: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.eventsList = action.payload;
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
    getEventDetails: (state, action) => {
      state.currentEvent = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { getRequest, getSuccess, getFailed, getError, getEventDetails } =
  eventSlice.actions;

export const eventReducer = eventSlice.reducer;

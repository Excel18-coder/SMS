import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booksList: [],
  loading: false,
  error: null,
  response: null,
  currentBook: null,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.booksList = action.payload;
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
    getBookDetails: (state, action) => {
      state.currentBook = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { getRequest, getSuccess, getFailed, getError, getBookDetails } =
  librarySlice.actions;

export const libraryReducer = librarySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feesList: [],
  loading: false,
  error: null,
  response: null,
  currentFee: null,
};

const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.feesList = action.payload;
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
    getFeeDetails: (state, action) => {
      state.currentFee = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { getRequest, getSuccess, getFailed, getError, getFeeDetails } =
  feeSlice.actions;

export const feeReducer = feeSlice.reducer;

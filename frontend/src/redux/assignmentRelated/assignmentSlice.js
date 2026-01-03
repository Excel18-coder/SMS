import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignmentsList: [],
  loading: false,
  error: null,
  response: null,
  currentAssignment: null,
  status: "idle", // idle, loading, succeeded, failed
  message: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.assignmentsList = action.payload;
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
    getAssignmentDetails: (state, action) => {
      state.currentAssignment = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createRequest: (state) => {
      state.loading = true;
      state.status = "loading";
      state.error = null;
      state.message = null;
    },
    createSuccess: (state, action) => {
      state.loading = false;
      state.status = "succeeded";
      state.response = action.payload;
      state.message = "Assignment created successfully";
      state.error = null;
    },
    createFailed: (state, action) => {
      state.loading = false;
      state.status = "failed";
      state.error = action.payload;
      state.response = null;
    },
    clearResponse: (state) => {
      state.response = null;
      state.error = null;
      state.message = null;
      state.status = "idle";
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getAssignmentDetails,
  updateRequest,
  updateSuccess,
  updateFailed,
  updateError,
  createRequest,
  createSuccess,
  createFailed,
  clearResponse,
} = assignmentSlice.actions;

export const assignmentReducer = assignmentSlice.reducer;

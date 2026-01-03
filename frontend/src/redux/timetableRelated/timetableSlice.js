import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timetablesList: [],
  loading: false,
  error: null,
  response: null,
  currentTimetable: null,
};

const timetableSlice = createSlice({
  name: "timetable",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.timetablesList = action.payload;
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
    getTimetableDetails: (state, action) => {
      state.currentTimetable = action.payload;
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
  getTimetableDetails,
} = timetableSlice.actions;

export const timetableReducer = timetableSlice.reducer;

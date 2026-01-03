import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely parse localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  status: "idle",
  userDetails: [],
  tempDetails: [],
  loading: false,
  currentUser: getUserFromStorage(),
  currentRole: getUserFromStorage()?.role || null,
  error: null,
  response: null,
  darkMode: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = "loading";
    },
    underControl: (state) => {
      state.status = "idle";
      state.response = null;
    },
    stuffAdded: (state, action) => {
      state.status = "added";
      state.response = null;
      state.error = null;
      state.tempDetails = action.payload;
    },
    authSuccess: (state, action) => {
      console.log("authSuccess called with payload:", action.payload);

      const userData = action.payload;
      const userRole = userData.role || "Student"; // Default to Student if role missing

      console.log("Setting currentRole to:", userRole);

      state.status = "success";
      state.currentUser = userData;
      state.currentRole = userRole;
      state.response = null;
      state.error = null;

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Updated state - currentRole:", state.currentRole);
      console.log("Stored in localStorage:", localStorage.getItem("user"));
    },
    authFailed: (state, action) => {
      state.status = "failed";
      state.response = action.payload;
    },
    authError: (state, action) => {
      state.status = "error";
      state.error = action.payload;
    },
    authLogout: (state) => {
      localStorage.removeItem("user");
      state.currentUser = null;
      state.status = "idle";
      state.error = null;
      state.currentRole = null;
    },

    doneSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getDeleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    getRequest: (state) => {
      state.loading = true;
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
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode,
} = userSlice.actions;

export const userReducer = userSlice.reducer;

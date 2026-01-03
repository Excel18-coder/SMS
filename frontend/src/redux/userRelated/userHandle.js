import api, { authHelpers } from "../../utils/api";
import {
  authError,
  authFailed,
  authLogout,
  authRequest,
  authSuccess,
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  stuffAdded,
} from "./userSlice";

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    console.log("Making login request:", {
      endpoint: `/${role}Login`,
      fields: { ...fields, password: "***" },
    });

    const result = await api.post(`/${role}Login`, fields);

    console.log("Login response received:", result.data);
    console.log("Response structure check:", {
      hasSuccess: !!result.data.success,
      hasToken: !!result.data.token,
      hasRole: !!result.data.role,
      role: result.data.role,
    });

    if (result.data.success && result.data.token) {
      // Ensure role is set
      const userData = {
        ...result.data,
        role: result.data.role || role, // Fallback to role parameter if not in response
      };

      console.log("Saving authentication data:", {
        token: userData.token.substring(0, 20) + "...",
        role: userData.role,
        userId: userData._id,
      });

      // Store token and user data
      authHelpers.saveAuth(userData.token, userData);

      console.log("Dispatching authSuccess with:", userData);
      dispatch(authSuccess(userData));
    } else {
      console.log("Login failed:", result.data.message);
      dispatch(authFailed(result.data.message || "Login failed"));
    }
  } catch (error) {
    console.error("Login error:", error);
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(authError(message));
  }
};

export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await api.post(`/${role}Reg`, fields);

    if (result.data.success && result.data.token) {
      authHelpers.saveAuth(result.data.token, result.data);
      dispatch(authSuccess(result.data));
    } else if (result.data.schoolName || result.data.school) {
      dispatch(stuffAdded());
    } else {
      dispatch(authFailed(result.data.message || "Registration failed"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(authError(message));
  }
};

export const logoutUser = () => (dispatch) => {
  authHelpers.clearAuth();
  dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching user details";
    dispatch(getError(message));
  }
};

export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.put(`/${address}/${id}`, fields);

    if (result.data.success) {
      if (result.data.schoolName || result.data.token) {
        dispatch(authSuccess(result.data));
      } else {
        dispatch(doneSuccess(result.data));
      }
    } else {
      dispatch(getFailed(result.data.message || "Update failed"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Error updating user";
    dispatch(getError(message));
  }
};

export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await api.post(`/${address}Create`, fields);

    if (result.data.success) {
      dispatch(stuffAdded(result.data));
    } else {
      dispatch(authFailed(result.data.message || "Operation failed"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Error adding data";
    dispatch(authError(message));
  }
};

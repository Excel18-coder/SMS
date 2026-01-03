import api from "../../utils/api";
import {
  createFailed,
  createRequest,
  createSuccess,
  getAssignmentDetails,
  getError,
  getFailed,
  getRequest,
  getSuccess,
  updateError,
  updateFailed,
  updateRequest,
  updateSuccess,
} from "./assignmentSlice";

export const getAllAssignments = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Route to appropriate endpoint based on address type
    let url;
    if (address === "Student") {
      url = `${process.env.REACT_APP_BASE_URL}/StudentAssignments/${id}`;
    } else if (address === "Subject") {
      url = `${process.env.REACT_APP_BASE_URL}/SubjectList/${id}`;
    } else if (address === "Teacher") {
      url = `${process.env.REACT_APP_BASE_URL}/TeacherAssignments/${id}`;
    } else if (address === "Class") {
      url = `${process.env.REACT_APP_BASE_URL}/Assignments/${id}`;
    } else {
      url = `${process.env.REACT_APP_BASE_URL}/AssignmentList/${id}`;
    }

    const result = await api.get(url);
    if (result.data.message && !result.data.success) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data.data || result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

export const getAssignmentById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getAssignmentDetails(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

export const submitAssignment = (fields) => async (dispatch) => {
  dispatch(updateRequest());

  try {
    const result = await api.post(
      `${process.env.REACT_APP_BASE_URL}/AssignmentSubmit`,
      fields
    );
    if (result.data.message && !result.data.success) {
      dispatch(updateFailed(result.data.message));
    } else {
      dispatch(updateSuccess(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(updateError(message));
  }
};

export const createAssignment = (fields) => async (dispatch) => {
  dispatch(createRequest());

  try {
    const result = await api.post(
      `${process.env.REACT_APP_BASE_URL}/AssignmentCreate`,
      fields
    );
    if (result.data.success) {
      dispatch(createSuccess(result.data));
      return { success: true, data: result.data };
    } else {
      dispatch(
        createFailed(result.data.message || "Failed to create assignment")
      );
      return { success: false, message: result.data.message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(createFailed(message));
    return { success: false, message };
  }
};

export const updateAssignment = (id, fields) => async (dispatch) => {
  dispatch(updateRequest());

  try {
    const result = await api.put(
      `${process.env.REACT_APP_BASE_URL}/Assignment/${id}`,
      fields
    );
    if (result.data.success) {
      dispatch(updateSuccess(result.data));
      return { success: true, data: result.data };
    } else {
      dispatch(updateFailed(result.data.message));
      return { success: false, message: result.data.message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(updateError(message));
    return { success: false, message };
  }
};

export const deleteAssignment = (id) => async (dispatch) => {
  dispatch(updateRequest());

  try {
    const result = await api.delete(
      `${process.env.REACT_APP_BASE_URL}/Assignment/${id}`
    );
    if (result.data.success) {
      dispatch(updateSuccess(result.data));
      return { success: true };
    } else {
      dispatch(updateFailed(result.data.message));
      return { success: false, message: result.data.message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(updateError(message));
    return { success: false, message };
  }
};

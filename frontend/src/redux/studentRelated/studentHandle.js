import api from "../../utils/api";
import {
  getError,
  getFailed,
  getRequest,
  getSuccess,
  stuffDone,
} from "./studentSlice";

export const getAllStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/Students/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch students"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching students";
    dispatch(getError(message));
  }
};

export const updateStudentFields =
  (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const result = await api.put(`/${address}/${id}`, fields, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.data.success) {
        dispatch(stuffDone());
      } else {
        dispatch(getFailed(result.data.message || "Failed to update student"));
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error updating student";
      dispatch(getError(message));
    }
  };

export const removeStuff = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.put(`/${address}/${id}`);
    if (result.data.success) {
      dispatch(stuffDone());
    } else {
      dispatch(getFailed(result.data.message || "Failed to remove"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Error removing";
    dispatch(getError(message));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/Sclass/Students/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch students"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching students";
    dispatch(getError(message));
  }
};

export const getStudentById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch student"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching student";
    dispatch(getError(message));
  }
};

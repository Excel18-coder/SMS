import api from "../../utils/api";
import {
  detailsSuccess,
  getError,
  getFailed,
  getFailedTwo,
  getRequest,
  getStudentsSuccess,
  getSubDetailsRequest,
  getSubDetailsSuccess,
  getSubjectsSuccess,
  getSuccess,
} from "./sclassSlice";

export const getAllSclasses = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}List/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data || []));
    } else {
      dispatch(getFailedTwo(result.data.message || "Failed to fetch classes"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching classes";
    dispatch(getError(message));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/Sclass/Students/${id}`);
    if (result.data.success) {
      dispatch(getStudentsSuccess(result.data.data || []));
    } else {
      dispatch(getFailedTwo(result.data.message || "Failed to fetch students"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching students";
    dispatch(getError(message));
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}/${id}`);
    if (result.data.success) {
      dispatch(detailsSuccess(result.data.data));
    } else if (result.data) {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching details";
    dispatch(getError(message));
  }
};

export const getSubjectList = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}/${id}`);
    if (result.data.success) {
      dispatch(getSubjectsSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch subjects"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching subjects";
    dispatch(getError(message));
  }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/FreeSubjectList/${id}`);
    if (result.data.success) {
      dispatch(getSubjectsSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch subjects"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching subjects";
    dispatch(getError(message));
  }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
  dispatch(getSubDetailsRequest());

  try {
    const result = await api.get(`/${address}/${id}`);
    if (result.data.success) {
      dispatch(getSubDetailsSuccess(result.data.data));
    } else if (result.data) {
      dispatch(getSubDetailsSuccess(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching subject details";
    dispatch(getError(message));
  }
};

import api from "../../utils/api";
import {
  doneSuccess,
  getError,
  getFailed,
  getRequest,
  getSuccess,
  postDone,
} from "./teacherSlice";

export const getAllTeachers = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/Teachers/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch teachers"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching teachers";
    dispatch(getError(message));
  }
};

export const getTeacherDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/Teacher/${id}`);
    if (result.data.success) {
      dispatch(doneSuccess(result.data.data));
    } else if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching teacher details";
    dispatch(getError(message));
  }
};

export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const result = await api.put(
        `/TeacherSubject`,
        { teacherId, teachSubject },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result.data.success) {
        dispatch(postDone());
      } else {
        dispatch(
          getFailed(result.data.message || "Failed to update teacher subject")
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error updating teacher subject";
      dispatch(getError(message));
    }
  };

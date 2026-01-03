import api from "../../utils/api";
import {
  getError,
  getFailed,
  getRequest,
  getSuccess,
  getTimetableDetails,
} from "./timetableSlice";

export const getAllTimetables = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Route to appropriate endpoint based on address type
    let url;
    if (address === "Sclass" || address === "Class") {
      url = `${process.env.REACT_APP_BASE_URL}/Timetable?classId=${id}`;
    } else if (address === "School") {
      url = `${process.env.REACT_APP_BASE_URL}/SchoolTimetables/${id}`;
    } else if (address === "Teacher") {
      url = `${process.env.REACT_APP_BASE_URL}/TeacherTimetable/${id}`;
    } else {
      url = `${process.env.REACT_APP_BASE_URL}/Timetable?classId=${id}`;
    }

    const result = await api.get(url);
    if (result.data.message && !result.data.success) {
      dispatch(getFailed(result.data.message));
    } else {
      // Ensure data is always an array
      const data = Array.isArray(result.data.data)
        ? result.data.data
        : result.data.data
        ? [result.data.data]
        : [];
      dispatch(getSuccess(data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

export const getTimetableById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getTimetableDetails(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

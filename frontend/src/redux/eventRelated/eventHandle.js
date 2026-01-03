import api from "../../utils/api";
import {
  getError,
  getEventDetails,
  getFailed,
  getRequest,
  getSuccess,
} from "./eventSlice";

export const getAllEvents = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Route to appropriate endpoint based on address type
    let url;
    if (address === "School") {
      url = `${process.env.REACT_APP_BASE_URL}/SchoolEvents/${id}`;
    } else {
      url = `${process.env.REACT_APP_BASE_URL}/EventList/${id}`;
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

export const getEventById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getEventDetails(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

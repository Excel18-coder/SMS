import api from "../../utils/api";
import {
  getError,
  getFailed,
  getMessageDetails,
  getRequest,
  getSuccess,
} from "./messageSlice";

export const getAllMessages = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Route to inbox messages endpoint with proper query parameters
    const url = `${process.env.REACT_APP_BASE_URL}/InboxMessages?userId=${id}&userModel=${address}`;

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

export const getMessageById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getMessageDetails(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

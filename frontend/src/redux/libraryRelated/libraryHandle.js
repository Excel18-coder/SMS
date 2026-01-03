import api from "../../utils/api";
import {
  getBookDetails,
  getError,
  getFailed,
  getRequest,
  getSuccess,
} from "./librarySlice";

export const getAllBooks = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Route to appropriate endpoint - library uses Books endpoint with schoolId
    const url = `${process.env.REACT_APP_BASE_URL}/Books?schoolId=${id}`;

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

export const getBookById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getBookDetails(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

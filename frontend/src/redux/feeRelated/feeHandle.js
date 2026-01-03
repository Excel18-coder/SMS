import api from "../../utils/api";
import {
  getError,
  getFailed,
  getFeeDetails,
  getRequest,
  getSuccess,
} from "./feeSlice";

export const getAllFees = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    // Route to appropriate endpoint based on address type
    let url;
    if (address === "Student") {
      url = `${process.env.REACT_APP_BASE_URL}/StudentFees/${id}`;
    } else if (address === "Class") {
      url = `${process.env.REACT_APP_BASE_URL}/ClassFees/${id}`;
    } else {
      url = `${process.env.REACT_APP_BASE_URL}/FeeList/${id}`;
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

export const getFeeById = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getFeeDetails(result.data));
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Network error";
    dispatch(getError(message));
  }
};

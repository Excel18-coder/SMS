import api from "../../utils/api";
import { getError, getFailed, getRequest, getSuccess } from "./noticeSlice";

export const getAllNotices = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}List/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch notices"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching notices";
    dispatch(getError(message));
  }
};

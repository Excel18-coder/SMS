import api from "../../utils/api";
import { getError, getFailed, getRequest, getSuccess } from "./complainSlice";

export const getAllComplains = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await api.get(`/${address}List/${id}`);
    if (result.data.success) {
      dispatch(getSuccess(result.data.data || []));
    } else {
      dispatch(getFailed(result.data.message || "Failed to fetch complains"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error fetching complains";
    dispatch(getError(message));
  }
};

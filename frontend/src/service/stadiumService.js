import apiClient from "./apis/apiClient";

export const fetchStadiums = async () => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get('/stadiums', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw error
  }
}
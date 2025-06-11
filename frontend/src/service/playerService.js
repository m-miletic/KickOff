import apiClient from "./apis/apiClient"

export const fetchPlayersByTeamId = async (fetchObj) => {
  try { 
    const response = await apiClient.get(`/players`, {
      params: fetchObj
    });
    return response.data.data;
  } catch (error) {
    throw error
  }
}
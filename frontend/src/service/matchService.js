import apiClient from "./apis/apiClient";

export const createMatch = async (formData) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/matches`, formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data
  } catch (error) {
    console.error("Create match error:", error);
    throw error;
  }
}

export const fetchMatchesByTournament = async (tournamentId, filters) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/matches/tournament/${tournamentId}`, {
      params: {
        ...filters,
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error.response.data
  }
;}

export const editMatch = async (updatedData) => {
  const id = updatedData.matchId;
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.patch(`/matches/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error("Edit match error:", error);
    throw error; 
  }
};

export const deleteMatch = async (id) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.delete(`/matches/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Delete match error:", error);
    throw error; // rethrow so caller can handle it
  }
};

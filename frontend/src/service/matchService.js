import apiClient from "./apis/apiClient";

export const createMatch = async (matchObject) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/matches`, matchObject,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("response match: ", response)
    return response.data
  } catch (error) {
    console.log("a sta sad match error ", error)
    throw error.response.data;
  }
}

export const fetchMatchesByTournament = async (tournamentId) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/matches/tournament/${tournamentId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("Service fetch matches by tournament response: ", response)
    return response.data;
  } catch (error) {
    console.log("Error while trying to fetch matches based on tournament id: ", error)
    throw error.response.data
  }
}


export const editMatch = async (id, updatedData) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.patch(`/matches/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data; // return API response data so caller can use it
  } catch (error) {
    console.error("Edit match error:", error);
    throw error; // rethrow so caller can handle it
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
  } catch (error) {
    console.error("Delete match error:", error);
    throw error; // rethrow so caller can handle it
  }
};

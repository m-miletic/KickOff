import apiClient from "./apis/apiClient";

export const createMatch = async (matchObject) => {
  console.log("Match objekt: ", matchObject)
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
  } catch (error) {
    throw error;
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
    // Return the full API response object (success, data, message)
    return response.data;
  } catch (error) {
    // Return a consistent error object to avoid unhandled exceptions in the UI
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || "Unknown error"
    };
  }
}

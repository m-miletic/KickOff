import apiClient from "./apis/apiClient";

export const fetchAllTournaments = async ( filters ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get("/tournaments", {
      params: {
        ...filters
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("response jbt: ", response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTournament = async ( tournamentObject ) => {
  try {
    const response = await apiClient.post("/tournaments", tournamentObject);
    console.log("Create Tournament response: ", response);

    return response.data;
  } catch (error) {
    throw new Error("There was a problem while trying to send POST request for creating a tournament.");
  }
}

export const enrollTeam = async (enrollTeamObj) => {
  console.log("Tu sam");
  try {
    const response = await apiClient.post(`/tournaments/enroll-team`, enrollTeamObj);
    return response;
  } catch (error) {
    console.log("a odavde mozda: ", error)
    throw error.response.data.message; 
  }
}


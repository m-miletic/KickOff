import apiClient from "./apis/apiClient";

export const fetchAllTournaments = async ( filters ) => {
  try {
    const response = await apiClient.get("/tournaments", {
      params: {
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    throw new Error("There was a problem while trying to send GET request for fetching tournaments.");
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
  try {
    const response = await apiClient.post(`/tournaments/enroll-team`, enrollTeamObj);
    return response;
  } catch (error) {
    throw error; 
  }
}


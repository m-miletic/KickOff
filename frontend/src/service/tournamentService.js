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
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post("/tournaments", 
      tournamentObject,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("Create Tournament response: ", response);
    return response.data;
  } catch (error) {
    throw new Error("There was a problem while trying to send POST request for creating a tournament.");
  }
}

export const enrollTeam = async (enrollTeamObj) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/tournaments/enroll-team`, 
      enrollTeamObj,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        } 
      }
    );
    return response;
  } catch (error) {
    console.log("a odavde mozda: ", error)
    throw error.response.data.message; 
  }
}


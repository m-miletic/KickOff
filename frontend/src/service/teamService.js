import apiClient from "./apis/apiClient";

export const fetchAllTeams = async ( filters ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get("/teams", {
      params: {
        ...filters
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response;
  } catch (error) {
    console.error("team service error: ", error);
    throw new Error("There was a problem while fetching team entities.");
  }
};

export const fetchTeamsByTournament = async ( filters ) => {
  try {
    const response = await apiClient.get("/teams/by-tournament", {
      params: {
        ...filters
      }
    });
    return response;
  } catch (error) {
    console.error("TeamService(original) Error: ", error);
    throw new Error("There was a problem while fetching team entities.");
  }
};

export const deleteTeamById = async ( filter, id ) => {
  try {
    const response = await apiClient.delete(`/teams/${id}`, {
      params: {
        ...filter
      }
    });
    return response;
  } catch (error) {
    throw new Error("TeamService Error -> Couldn't fetch teams");
  }
}

export const createTeam = async (teamObject) => {
  try {
    const response = await apiClient.post(`/teams`, teamObject);
    return response;
  } catch (error) {
    throw new Error("There was a problem while trying to send a POST request for creating a team.");
  }
}

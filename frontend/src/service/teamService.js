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
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamsByTournament = async ( filters ) => {
  try {
    const response = await apiClient.get("/teams/by-tournament", {
      params: {
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTeamById = async ( id ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.delete(`/teams/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const createTeam = async (teamObject) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/teams`, teamObject, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

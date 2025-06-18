import js from "@eslint/js";
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

export const fetchTeamsByTournament = async (tournamentId, page) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.get(`/teams/tournament/${tournamentId}`,
      page,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
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
};

export const getTeamByTeamRepresentative = async (userId) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/teams/user/${userId}`, 
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTeamImage = async (id, payload) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.patch(`/teams/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


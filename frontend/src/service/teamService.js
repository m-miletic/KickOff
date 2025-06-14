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

export const fetchTeamsByTournament = async ( fetchTeamObj ) => {
  try {
    const response = await apiClient.get("/teams/by-tournament", {
      params: {
        ...fetchTeamObj
      }
    });
    return response.data.data;
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

export const fetchTeamByRepresentative = async (fetchTeamObj) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/teams/by-representative`, {
      params: {
        ...fetchTeamObj
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const uploadTeamCrest = async (uploadImageObj) => {
  const jwt = localStorage.getItem('token');
  console.log("uploadImageObj: ", uploadImageObj)
  try {
    const response = await apiClient.patch(`/teams/upload-crest`, uploadImageObj, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};


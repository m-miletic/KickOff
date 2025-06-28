import apiClient from "./apis/apiClient";

export const fetchAllTeams = async (filters) => {
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
    console.log("Fetch All Teams Service response: ", response)
    return response.data;
  } catch (error) {
    console.log("Fetch All Teams Service error: ", error)
    throw error;
  } 
};

export const getMyTeam = async (representativeId) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.get(`/teams/myTeam/${representativeId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("SERVICE ***** Get My Team Data Response: ", response)
    return response.data;
  } catch (error) {
    console.log("SERVICE ***** Error while trying to retrieve my team data: ", error)
    throw error.response.data
    
  }
}

export const fetchTeamsByTournament = async (tournamentId, page) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.get(`/teams/tournament/${tournamentId}`,
      {
        params: {
          page: page
        },
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
    console.log("Delete Team Service response: ", response)
    return response.data;
  } catch (error) {
    console.log("Delete Team Service Error: ", error)
    throw error.response.data;
  }
}

export const createTeam = async (formData) => {
  console.log("FormData: ", formData)

  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/teams`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("Create Team Service Response: ", response)
    return response.data;
  } catch (error) {
    console.log("Error while creating team: ", error)
    throw error.response.data;
  }
};

export const getTeamByTeamRepresentative = async (userId) => {
  console.log("I'm in getTeamByTeamRepresentative")
  console.log("Check UserID - ", userId)
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/teams/user/${userId}`, 
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("Service response: ", response.data)
    return response.data;
  } catch (error) {
    console.log("Service Error while trying to fetch team by representative error - ", error)
    throw error.response.data
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
    return response.data
  } catch (error) {
    throw error
  }
};

export const getTeam = async (teamId) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/teams/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data
  } catch (error) {
    throw error
  }
};


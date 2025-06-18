import apiClient from "./apis/apiClient";

export const fetchAllTournaments = async () => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get("/tournaments",
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

export const fetchOrganizersTournament = async (fetchTourObj) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/tournaments/by-organizer`,{
      params: {
        ...fetchTourObj
      }, 
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const updateTournament = async (id, updateTournamentObj) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.patch(`/tournaments/${id}`, 
      updateTournamentObj,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}


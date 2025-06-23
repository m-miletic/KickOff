import apiClient from "./apis/apiClient";

export const fetchAllTournaments = async (pageNumber) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get("/tournaments", {
      params: {
        pageNumber
      }
    },
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

export const fetchAllUpcomingTournaments = async (pageNumber) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get("/tournaments/upcoming", {
      params: {
        pageNumber
      }
    },
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

export const fetchAllActiveTournaments = async (pageNumber) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get("/tournaments/active", {
      params: {
        pageNumber
      }
    },
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

export const fetchActiveAndUpcomingTournaments = async () => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.get("/tournaments/available", {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("Fetch active and upcoming tournaments response: ", response)
    return response.data
  } catch (error) {
    console.log("Error while trying to retrieve all available tournaments - ", error)
    throw error.response.data
  }
}



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
    console.error("Error while trying to create tournament - api error response: ", error.response.data)
    throw error.response.data
  }
}

export const enrollTeam = async (enrollTeamObj) => {
  console.log("In enrol team")
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
    console.log("Enroll Team Service Response: ", response)
    return response.data
  } catch (error) {
    console.log("Error while trying to approve team enrollment - ", error)
    throw error.response.data; 
  }
}

export const removeTeamFromTournament = async (teamId) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.patch(`/tournaments/teams/${teamId}/remove`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("removeTeamFromTournament response: ", response)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const fetchOrganizersTournament = async ( userId ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/tournaments/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data;
  } catch (error) { 
    throw error.response.data
  } 
}

export const updateTournament = async (id, updateTournamentObj) => {
  const jwt = localStorage.getItem('token');

  try {
    const response = await apiClient.patch(`/tournaments/${id}`, updateTournamentObj, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    console.log("Update success:", response);
    return response;
  } catch (error) {
    console.error("Update error:", error);

    // Optional enhancement: attach backend message to the error
    if (error.response) {
      throw {
        message: error.response.data?.message || "Unexpected error",
        status: error.response.status,
        data: error.response.data
      };
    }

    throw error; // Re-throw for unknown/unstructured errors
  }
};



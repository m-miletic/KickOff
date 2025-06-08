import apiClient from "./apis/apiClient";

export const fetchRequestsByApprover = async ( selectedFilters ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get('/requests/by-approver', {
      params: {
        ...selectedFilters
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("fetchRequestsByApprover response: ", response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const fetchRequestsByRequester = async ( selectedFilters ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get('/requests/by-requester', {
      params: {
        ...selectedFilters
      }, 
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("fetchRequestsByRequester response: ", response);
    return response.data.data;
  } catch (error) {
    console.log("error", error)
    throw error;
  }
}

export const fetchAllRequestsByUserId = async ( selectedFilters, userId ) => {
  try {
    const response = await apiClient.get(`/requests/${userId}`, {
      params: {
        ...selectedFilters
      }
    });
    return response;
  } catch (error) {
    throw new Error("Service -> Error fetching data: ", error.message);
  }
}

export const updateRequest = async ( updateObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.put(`/requests`, updateObject, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("response: ", response);
    return response;
  } catch (error) {
    throw error;
  }
}

export const createRoleChangeRequest = async ( requestObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post('/requests/role-change',
      requestObject,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }

    );
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
}

export const createEnrollTeamRequest = async ( requestObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/requests/enroll-team`,
      requestObject, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
}


export const createTeamRegistrationRequest = async ( requestObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/requests/team-creation`, 
      requestObject, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response;
  } catch (error) {
    throw (error.response.data.message);
  }
}

export const createTournamentCreationRequest = async ( requestObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/requests/tournament-creation`,
      requestObject, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response;
  } catch (error) {
    console.log("error when creating tournament creation request: ", error)
    throw error.response.data.message;
  }
}


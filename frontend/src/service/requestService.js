import apiClient from "./apis/apiClient";

export const fetchRequestsByApprover = async ( userId, selectedFilters ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/requests/approver/${userId}`, {
      params: {
        ...selectedFilters
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const fetchRequestsByRequester = async ( userId, selectedFilters ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/requests/requester/${userId}`, {
      params: {
        ...selectedFilters
      }, 
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("Response By Requester: ", response)
    return response.data;
  } catch (error) {

    console.error("Error while fetching requests by requester - api error response: ", error.response.data)
    throw error.response.data;
  }
}

export const fetchAllRequestsByUserId = async ( userId, selectedFilters ) => {
  try {
    const response = await apiClient.get(`/requests/approver/${userId}`, {
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
    const response = await apiClient.patch(`/requests`, updateObject, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const createEnrollTeamRequest = async ( requestObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/requests/enroll-team`, 
      requestObject,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("createEnrollTeamRequest u tryu response: ", response)
    console.log("test: ", response.data)
    return response.data;
  } catch (error) {
    console.log("createEnrollTeamRequest u catch error-u: ", error)
    throw error.response.data;
  }
}


export const createTeamRegistrationRequest = async ( requesterId ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/requests/team/${requesterId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("Create Request For Team Registration Service Response: ", response)
    return response.data;
  } catch (error) {
    console.log("Error while creating request for creating a tournament - api error response: ", error)
    throw error.response.data;
  }
}

export const createTournamentCreationRequest = async ( requesterId ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/requests/tournament/${requesterId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("createTournamentCreationRequest: ", response)
    return response.data;
  } catch (error) {
    console.log("Error while creating request for creating a tournament - api error response: ", error)
    throw error.response.data;
  }
}


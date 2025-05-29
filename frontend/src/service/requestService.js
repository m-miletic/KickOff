import apiClient from "./apis/apiClient";

export const fetchRequestsByApprover = async ( selectedFilters ) => {
  try {
    const response = await apiClient.get('/requests/by-approver', {
      params: {
        ...selectedFilters
      }
    });
    console.log("response: ", response);
    return response;
  } catch (error) {
    throw new Error("Service -> Error fetching data: ", error.message);
  }
}

export const fetchRequestsByRequester = async ( selectedFilters ) => {
  try {
    const response = await apiClient.get('/requests/by-requester', {
      params: {
        ...selectedFilters
      }
    });
    console.log("response: ", response);
    return response;
  } catch (error) {
    throw new Error("Service -> Error fetching data: ", error.message);
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

/* export const fetchRequestsByOrganizerId = async ( organizerId ) => {
  console.log("organizerId: ", organizerId)
  try {
    const response = await apiClient.get(`/requests/by-organizer/${organizerId}`)
    return response;
  } catch (error) {
    throw new Error("Service -> Error feching data: ", error.message);
  }
} */

export const updateRequest = async ( updatedRequest, requestId ) => {
  try {
    const response = await apiClient.put(`/requests/${requestId}`, updatedRequest);
    console.log("updated request: ", updateRequest);
    console.log("response: ", response);
    return response;
  } catch (error) {
    throw new Error("Service -> Error fetching data: ", error.message);
  }
}

export const createRequest = async ( requestObject ) => {
  try {
    const response = await apiClient.post(`/requests`, requestObject);
    return response;
  } catch (error) {
    throw error;
  }
}

export const createRoleChangeRequest = async ( requestObject ) => {
  try {
    const response = await apiClient.post('/requests/role-change', requestObject);
    return response;
  } catch (error) {
    throw error;
  }
}

export const createEnrollTeamRequest = async ( requestObject ) => {
  try {
    const response = await apiClient.post(`/requests/enroll-team`, requestObject);
    return response;
  } catch (error) {
    throw error;
  }
}


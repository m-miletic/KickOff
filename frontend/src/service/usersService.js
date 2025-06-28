import apiClient, { apiAuthClient } from "./apis/apiClient";

export const fetchUsers = async (filter) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get('/users', {
      params: {
        ...filter
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("User Service Response - ", response);
    return response.data;
  } catch (error) {
    console.log("Error while fetching users - api response error: ", error);
    throw error.response.data;
  }
};

export const deleteUser = async ( id ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("Delete User Service Response: ", response);
    return response.data;
  } catch (error) {
    console.log("Delete User Service Error: ", error);
    throw error.response.data;
  }
};

export const changeUserRole = async ( updateObject ) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.patch('/users/role-change',
      updateObject,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.log("error: ", error);
    throw error.response.data.message;
  }
};

/* export const fetchMyData = async (id) => {
  const jwt = localStorage.getItem('token')
  console.log("Ftech my data Check id: ", id)
  try {
    const response = await apiAuthClient.get(`/users/me/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    console.log("resssss- ", response)
  } catch (error) {
    console.log("Service Error while trying to fetch my data error - ", error)
    throw error;
  }
}
 */
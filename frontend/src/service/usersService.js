import apiClient from "./apis/apiClient";

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
    return response.data;
  } catch (error) {
    console.log("Delete User Service Error: ", error);
    throw error.response.data;
  }
};

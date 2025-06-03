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
    console.log("Error in usersService -> ", error);
    throw error;
  }
};

export const deleteUser = async ( filter, id ) => {
  try {
    const response = await apiClient.delete(`/users/${id}`, {
      params: {
        ...filter
      }
    });
    return response.data;
  } catch (error) {
    return error;
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

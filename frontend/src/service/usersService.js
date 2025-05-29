import apiClient from "./apis/apiClient";

export const fetchUsers = async (filter) => {
  try {
    const response = await apiClient.get('/users', {
      params: {
        ...filter
      }
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.log("Error in usersService -> couldn't fetch users");
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
  try {
    const response = await apiClient.patch('/users/role-change', updateObject);
    return response;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};

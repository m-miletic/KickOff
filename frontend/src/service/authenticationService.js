import { apiAuthClient } from "./apis/apiClient";

export const login = async (loginCredentials) => {
  try {
    const response = await apiAuthClient.post(`/login`, loginCredentials);
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const logout = async (refreshToken) => {
  try {
    const response = await apiAuthClient.delete(`/logout`,
      {
        data: {refreshToken}   // { data: refreshToken } jer .delete ne ocekuje RequestBody po defaultu
      }
    )
    return response.data
  } catch (error) {
    console.log("Error while trying to log out: ", error)
    throw error.response.data
  }
}

export const register = async (registrationData) => {
  try {
    const response = await apiAuthClient.post(`/register`, registrationData)
    console.log("Service response: ", response.data)
    return response.data;
  } catch (error) {
    console.log("Error while trying to register: ", error)
    throw error.response.data
  }
}
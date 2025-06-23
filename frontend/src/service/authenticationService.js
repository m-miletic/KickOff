import { apiAuthClient } from "./apis/apiClient";

export const login = async (loginCredentials) => {
  try {
    const response = await apiAuthClient.post(`/auth/login`, loginCredentials);
    console.log("Login Service Response: ", response)
    return response.data
  } catch (error) {
    console.log("Error while trying to log in: ", error)
    throw error.response.data
  }
}

export const logout = async (refreshToken) => {
  console.log("in service rt: ", refreshToken)
  try {
    const response = await apiAuthClient.delete(`/auth/logout`,
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
    const response = await apiAuthClient.post(`/auth/register`, registrationData)
    console.log("Service response: ", response.data)
    return response.data;
  } catch (error) {
    console.log("Error while trying to register: ", error)
    throw error.response.data
  }
}
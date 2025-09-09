import apiClient from "./apis/apiClient";

export const getStadiums = async () => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get('/stadiums', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("Error while trying to fetch stadiums: ", error)
    throw error.response.data
  }
}

export const addStadium = async () => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.post("/stadiums", 
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.log("Error While trying to create stadium: ", error)
    throw error.response.data
  }
}
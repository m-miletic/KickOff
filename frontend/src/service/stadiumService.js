import apiClient from "./apis/apiClient";

export const fetchStadiums = async () => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get('/stadiums', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log("Fetch Stadiums Service Response: ", response)
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
    console.log("Add Stadium Response: ", response)
    return response.data
  } catch (error) {
    console.log("Error While trying to create stadium: ", error)
    throw error.response.data
  }
}
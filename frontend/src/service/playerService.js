import apiClient from "./apis/apiClient"


// di se koristi
export const fetchPlayersByTeamId = async (fetchObj) => {
  try { 
    const response = await apiClient.get(`/players`, {
      params: fetchObj
    });
    return response.data.data
  } catch (error) {
    throw error
  }
};

export const editPlayer = async (payload, id) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.patch(`/players/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("Edit Player Service response: ", response)
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response.data
    } else {
      throw error
    }   
  }
};

export const addPlayer = async (payload) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.post(`/players`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("Add Player Service response: ", response)
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response.data
    } else {
      throw error
    }   
  }
};

export const deletePlayer = async (id) => {
  const jwt = localStorage.getItem('token')
  try {
    const response = await apiClient.delete(`/players/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data
  } catch (error) {
    throw error
  }
};  
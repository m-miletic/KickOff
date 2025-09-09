import { formatDate } from "@fullcalendar/core/index.js";
import apiClient from "./apis/apiClient";

export const createMatch = async (matchObject) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.post(`/matches`, matchObject,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    console.log("response match: ", response)
    return response.data
  } catch (error) {
    console.log("a sta sad match error ", error)
    throw error.response.data;
  }
}

export const fetchMatchesByTournament = async (tournamentId, filters) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.get(`/matches/tournament/${tournamentId}`, {
      params: {
        ...filters,
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error: ", error)
    throw error.response.data
  }
;}

export const editMatch = async (id, updatedData) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.patch(`/matches/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error("Edit match error:", error);
    throw error; 
  }
};

export const deleteMatch = async (id) => {
  const jwt = localStorage.getItem('token');
  try {
    const response = await apiClient.delete(`/matches/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Delete match error:", error);
    throw error; // rethrow so caller can handle it
  }
};

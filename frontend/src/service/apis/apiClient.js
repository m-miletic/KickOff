import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    // mogu li ode slat Bearer jwt umisto u svakom posebnom file-u ?
  },
});
export default apiClient;

export const apiAuthClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
)

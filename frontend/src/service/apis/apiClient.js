import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default apiClient;


/* // will add authorization token to each request ?
apiClient.interceptors.response.use(
  response => response, // Any status code that lie WITHIN the range of 2xx cause this function to trigger
  error => { // Any status codes that falls OUTSIDE the range of 2xx cause this function to trigger
    console.log("API call failed: ", error);
    console.log("***** API Client Error *****");
    if (error.response.status === 401) {
      console.log("Unauthorized!");
    } else if (error.response.status === 404) {
      console.log("Not found!");
    }
  }
); */
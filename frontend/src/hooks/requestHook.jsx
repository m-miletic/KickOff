import { useEffect, useState } from "react";
import { fetchRequestsByApprover, fetchRequestsByRequester } from "../service/requestService";

export const useFetchRequests = ( userId, selectedFilters, activeComponent ) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(null);

  console.log("TEST inside Hook - userID: ", userId)

  useEffect(() => {
    const getRequests = async () => {
      if (!userId) return

      let response;
      try {
        if(activeComponent === "recievedRequests") {
          response = await fetchRequestsByApprover(userId, selectedFilters);
          setRequests(response.data.requests);
          setTotalPages(response.data.totalPages);
        } else if (activeComponent === "myRequests") {
          response = await fetchRequestsByRequester(userId, selectedFilters);
          setRequests(response.data.requests);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Fetch requests by approver/requester error message: " + error.data.message)
        setError(error.data.message)
      }
    };

    getRequests();
  }, [selectedFilters, activeComponent, userId]);

  return { requests, setRequests, totalPages, error };
};



/* export const useFetchPendingRequestsCount = (setTotalPendingRequests, setError) => {
  useEffect(() => {
    const getPendingReqCount = async () => {
      try {
        const response = await fetchRequestsByApprover();
        setTotalPendingRequests(response.data.totalPendingRequests);
      } catch (error) {
        console.log("Component -> error: ", error);
        
      }
    };

    getPendingReqCount();
  }, []);
};
 */
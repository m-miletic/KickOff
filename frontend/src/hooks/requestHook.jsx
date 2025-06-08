import { useEffect, useState } from "react";

import { fetchRequestsByApprover, fetchRequestsByRequester } from "../service/requestService";

export const useFetchRequests = ( selectedFilters, activeComponent ) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(null);


  useEffect(() => {
    const getRequests = async () => {
      let response;
      try {
        if(activeComponent === "recievedRequests") {
          response = await fetchRequestsByApprover(selectedFilters);
          console.log("rq: ", response);
          setRequests(response.requests);
          setTotalPages(response.totalPages);
        } else if (activeComponent === "sentRequests") {
          response = await fetchRequestsByRequester(selectedFilters);
          setRequests(response.requests);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        setError(error);
      }
    };

    getRequests();
  }, [selectedFilters, activeComponent]);

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
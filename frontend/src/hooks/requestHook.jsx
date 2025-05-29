import { useEffect, useState } from "react";

import { enrollTeam } from "../service/tournamentService";
import { fetchRequestsByApprover, fetchRequestsByRequester } from "../service/requestService";

export const useFetchRequests = ( selectedFilters, activeComponent ) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  // console.log("selectedFilters: ", selectedFilters);

  useEffect(() => {
    const getRequests = async () => {
      let response;
      try {
        if(activeComponent === "recievedRequests") {
          response = await fetchRequestsByApprover(selectedFilters);
          setRequests(response.data.requests);
        } else if (activeComponent === "sentRequests") {
          response = await fetchRequestsByRequester(selectedFilters);
          setRequests(response.data.requests);
        }
      } catch (error) {
        setError(error);
      }
    }
    getRequests();
  }, [selectedFilters, activeComponent]);

  return { requests, setRequests, error };
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
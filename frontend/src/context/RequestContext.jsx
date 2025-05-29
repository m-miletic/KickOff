import { createContext, useState } from "react";
/* import { useFetchPendingRequestsCount } from "../hooks/requestHook"; */

const RequestContext = createContext();

const RequestProvider = ({ children }) => {
  const [totalPendingRequests, setTotalPendingRequests] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);

/*   useFetchPendingRequestsCount(setTotalPendingRequests); */

  return(
    <RequestContext.Provider value={{ totalPendingRequests, setTotalPendingRequests, totalPages, setTotalPages }}>
      {children}
    </RequestContext.Provider>
  );

}
export { RequestProvider, RequestContext }
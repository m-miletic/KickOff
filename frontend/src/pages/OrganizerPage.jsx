import React, { useContext } from "react";
import Navbar from "../components/common/navigation/Navbar";
import RequestList from "../components/ui/request/RequestList";
import { RequestProvider } from "../context/RequestContext";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { LoggedUserContext } from "../context/LoggedUserContext";

const OrganizerPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const { decodedJwt, jwt, loading} = useContext(LoggedUserContext);

  if (loading) {
    return(
      <div>Loading...</div>
    );
  }

  return(
    <div>
      <Navbar />
      {(activeComponent === "sentRequests" || activeComponent === "recievedRequests") && 
        <div className="flex justify-center text-white mt-20">
          <RequestProvider>
            <RequestList decodedJwt={decodedJwt} />
          </RequestProvider>
        </div>
      }
    </div>
  );
}
export default OrganizerPage;
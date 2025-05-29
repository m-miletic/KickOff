import React, { useContext } from "react";
import Navbar from "../components/common/navigation/Navbar";
import RequestList from "../components/ui/request/RequestList";
import { jwtDecode } from "jwt-decode";
import { RequestProvider } from "../context/RequestContext";
import { ActiveComponentContext } from "../context/ActiveComponentContext";

const OrganizerPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);

  const jwt = localStorage.getItem('token');
  let decodedJwt = null;
  if (jwt != null ) {
    decodedJwt = jwtDecode(jwt);
  };

  return(
    <div>
      <Navbar decodedJwt={decodedJwt}/>
      
      { (activeComponent === "sentRequests" || activeComponent === "recievedRequests") && 
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
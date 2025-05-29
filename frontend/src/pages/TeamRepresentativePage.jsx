import React, { useContext } from "react";
import Navbar from "../components/common/navigation/Navbar";
import AdminRequestList from "../components/ui/request/RequestList";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { jwtDecode } from "jwt-decode";
import { RequestProvider } from "../context/RequestContext";
import RequestList from "../components/ui/request/RequestList";
import TeamRepresentativeTournamentList from "../components/ui/tournaments/TeamRepresentativeTournamentList";

const TeamRepresentativePage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);

  let decodedJwt = null;
  const jwt = localStorage.getItem('token');
  if (jwt) {
    try {
      decodedJwt = jwtDecode(jwt);
    } catch (error) {
      console.error("Invalid JWT:", error);
    }
  }

  console.log("active component: ", activeComponent);

  return(
    <div>

      <Navbar decodedJwt={decodedJwt} />

      <h1 className="text-white flex items-center justify-center mt-20">Team Representative Page - Home</h1>

      { (activeComponent === "sentRequests" || activeComponent === "recievedRequests") && 
        <div className="flex justify-center text-white mt-20">
          <RequestProvider>
            <RequestList decodedJwt={decodedJwt} />
          </RequestProvider>
        </div>
      }

      {activeComponent === "Tournaments" && 
        <div className="flex justify-center">
          <TeamRepresentativeTournamentList />
        </div>
      }

    </div>
  );
}
export default TeamRepresentativePage;

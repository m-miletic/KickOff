import React, { useContext, useEffect } from "react";
import Navbar from "../components/common/navigation/Navbar";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { RequestProvider } from "../context/RequestContext";
import RequestList from "../components/ui/request/RequestList";
import TeamRepresentativeTournamentList from "../components/ui/tournaments/TeamRepresentativeTournamentList";
import { LoggedUserContext } from "../context/LoggedUserContext";
import MyTeam from "../components/ui/team/MyTeam";
import useRoleVerification from "../hooks/useRoleVerification";

const TeamRepresentativePage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);

  useRoleVerification(decodedJwt, jwt);

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
      {activeComponent === "Tournaments" && 
        <div className="flex justify-center">
          <TeamRepresentativeTournamentList />
        </div>
      }
      {activeComponent === "My Team" &&
        <div className="flex justify-center mt-10">
          <MyTeam />
        </div>
      }
    </div>
  );
}
export default TeamRepresentativePage;

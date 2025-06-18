import React, { useContext, useEffect } from "react";
import Navbar from "../components/common/navigation/Navbar";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { RequestProvider } from "../context/RequestContext";
import RequestList from "../components/ui/request/RequestList";
import TeamRepresentativeTournamentList from "../components/ui/tournaments/TeamRepresentativeTournamentList";
import { LoggedUserContext } from "../context/LoggedUserContext";
import MyTeam from "../components/ui/team/MyTeam";
import useRoleVerification from "../hooks/useRoleVerification";
import Footer from "../components/common/footer/Footer";

const TeamRepresentativePage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const { decodedJwt, jwt } = useContext(LoggedUserContext);

  useRoleVerification(decodedJwt, jwt);

  return (
    <div className="min-h-screen flex flex-col"> {/* Make full height & flex column */}
      <Navbar />

      <main className="flex-grow">
        {(activeComponent === "sentRequests" || activeComponent === "recievedRequests") && 
          <div className="flex justify-center text-white mt-20">
            <RequestProvider>
              <RequestList />
            </RequestProvider>
          </div>
        }
        {activeComponent === "Active Tournaments" && 
          <div className="flex justify-center">
            <TeamRepresentativeTournamentList />
          </div>
        }
        {activeComponent === "Team Overview" &&
          <div className="flex justify-center mt-10">
            <MyTeam />
          </div>
        }
      </main>

      <Footer />
    </div>
  );
};
export default TeamRepresentativePage;

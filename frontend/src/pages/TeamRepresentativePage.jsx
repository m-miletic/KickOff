import React, { useContext, useEffect } from "react";
import Navbar from "../components/common/navigation/Navbar";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { RequestProvider } from "../context/RequestContext";
import RequestList from "../components/ui/request/RequestList";
import TeamRepresentativeTournamentList from "../components/ui/tournaments/TeamRepresentativeTournamentList";
import { apiAuthClient } from "../service/apis/apiClient";
import { LoggedUserContext } from "../context/LoggedUserContext";

const TeamRepresentativePage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);

  // ovo ce mi tribat za svaki page tako da ce ovo bit custom hook
  useEffect(() => {
    const verifyUserRole = async () => {
      console.log("verifyUserRole - executed")
      try {
        const response = await apiAuthClient.get(`/users/me/${decodedJwt.userId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        const actualRole = response.data.role;
        if (decodedJwt.role !== actualRole) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = "/login";
        }
      } catch (error) {
        // If the request fails (e.g. 401), logout anyway
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = "/login";
      }
    };

    verifyUserRole();

    const interval = setInterval(() => {
      verifyUserRole();
    }, 10000); // 10 sekundi u testnoj fazi - kasnije stavit npr svako 6 ili 12 sati

    return () => clearInterval(interval);

  }, [jwt, decodedJwt]);

  return(
    <div>
      <Navbar />
      <h1 className="text-white flex items-center justify-center mt-20">
        Team Representative Page - Home
      </h1>
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
    </div>
  );
}
export default TeamRepresentativePage;

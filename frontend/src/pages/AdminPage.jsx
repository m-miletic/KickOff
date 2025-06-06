import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/common/navigation/Sidebar";
import { RequestProvider } from "../context/RequestContext";
import { useRequestLisVisibilityOnResize } from "../hooks/useRequestListVisibilityOnResize";
import TeamList from "../components/ui/team/TeamList";
import UserList from "../components/ui/user/UserList";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import RequestList from "../components/ui/request/RequestList";
import { LoggedUserContext } from "../context/LoggedUserContext";
import { useHandleLogout } from "../hooks/useHandleLogout";
import AdminTournamentList from "../components/ui/tournaments/AdminTournamentList";

const AdminPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);

  const [hide, setHide] = useState(false);

  useRequestLisVisibilityOnResize(setHide);
  useHandleLogout(activeComponent);

  return(
    <RequestProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center mt-24 min-h-full">
            {activeComponent === 'dashboard' && <span className="text-white">Dashboard</span>}
            {activeComponent === 'recievedRequests' && <div className={`${hide ? 'hidden' : ''}`}> <RequestList decodedJwt={decodedJwt} /> </div>}
            {activeComponent === 'users' && <UserList />}
            {activeComponent === 'teams' && <TeamList />}
            {activeComponent === 'tournaments' && <AdminTournamentList /> }
          </div>
        </div>
      </div>
    </RequestProvider>
  );
}
export default AdminPage;
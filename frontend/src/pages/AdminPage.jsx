import React, { useContext, useState } from "react";
import Sidebar from "../components/common/navigation/Sidebar";
import { RequestProvider } from "../context/RequestContext";
import { useRequestLisVisibilityOnResize } from "../hooks/useRequestListVisibilityOnResize";
import TeamList from "../components/ui/team/TeamList";
import UserList from "../components/ui/user/UserList";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { useHandleLogout } from "../hooks/useHandleLogout";
import UpcomingTournaments from "../components/ui/tournaments/UpcomingTournaments";
import AdminsPendingRequests from "../components/ui/request/AdminsPendingRequests";

const AdminPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const [hide, setHide] = useState(false);

  useRequestLisVisibilityOnResize(setHide);
  useHandleLogout(activeComponent);

  return(
    <RequestProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div>
          {activeComponent === 'dashboard' && <span className="text-black">Dashboard</span>}
          <div className={`${hide ? 'hidden' : ''}`}> <AdminsPendingRequests /> </div>
          {activeComponent === 'users' && <UserList />}
          {activeComponent === 'teams' && <TeamList />}
          {activeComponent === 'upcomingTournaments' && <UpcomingTournaments /> }
        </div>
      </div>
    </RequestProvider>
  );
}
export default AdminPage;
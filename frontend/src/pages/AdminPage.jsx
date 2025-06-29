import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/common/navigation/Sidebar";
import { RequestProvider } from "../context/RequestContext";
import { useRequestLisVisibilityOnResize } from "../hooks/useRequestListVisibilityOnResize";
import TeamList from "../components/ui/team/TeamList";
import UserList from "../components/ui/user/UserList";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import UpcomingTournaments from "../components/ui/tournaments/UpcomingTournaments";
import AdminsPendingRequests from "../components/ui/request/AdminsPendingRequests";
import { logout } from "../service/authenticationService";
import { LoggedUserContext } from "../context/LoggedUserContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);
  const [hide, setHide] = useState(false);
  const { setJwt, setDecodedJwt, decodedJwt } = useContext(LoggedUserContext)
  const nav = useNavigate();

  useRequestLisVisibilityOnResize(setHide);

  const handleLogout = async () => {
    try {
      let refreshToken = localStorage.getItem('refreshToken')
      await logout(refreshToken)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setJwt(null)            // hvata iz localstrorage-a stare podatke pa setirma na null da immam navbar UI za gosta
      setDecodedJwt(null)   // hvata iz localstrorage-a stare podatke pa setirma na null da immam navbar UI za gosta
      nav("/home")
    } catch (error) {
      console.error("Error while trying to log out: ", error.message)
    }
  };

  useEffect(() => {
    if (activeComponent === "logout") {
      handleLogout();
    }
  }, [activeComponent]);

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
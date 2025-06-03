import React, { useContext, useState } from "react";
import Sidebar from "../components/common/navigation/Sidebar";
import AdminRequestList from "../components/ui/request/RequestList";
import { RequestProvider } from "../context/RequestContext";
import { useRequestLisVisibilityOnResize } from "../hooks/useRequestListVisibilityOnResize";
import { jwtDecode } from "jwt-decode";
import TeamList from "../components/ui/team/TeamList";
import UserList from "../components/ui/user/UserList";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import RequestList from "../components/ui/request/RequestList";
import { redirect, useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);

  const nav = useNavigate();

  const jwt = localStorage.getItem('token');
  let decodedJwt = null;
  if (jwt != null ) {
    decodedJwt = jwtDecode(jwt);
  };

  console.log("jwtDecode: ", decodedJwt);

  // test
  const [hide, setHide] = useState(false);
  useRequestLisVisibilityOnResize(setHide);


  // samo za test - vidit kako ovo odraxit kako triba
  if(activeComponent === 'logout') {
    localStorage.removeItem('token');
    nav('/login');
  }

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
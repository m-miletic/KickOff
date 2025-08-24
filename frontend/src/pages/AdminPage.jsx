import React, { useContext, useState } from "react";
import Sidebar from "../components/common/navigation/Sidebar";
import TeamList from "../components/ui/team/TeamList";
import UserList from "../components/ui/user/UserList";
import AdminsPendingRequests from "../components/ui/request/AdminsPendingRequests";
import { logout } from "../service/authenticationService";
import { useNavigate } from "react-router-dom";

/* *** ADD FOR RESPONSIVENESS *** */
/* import { useRequestLisVisibilityOnResize } from "../hooks/useRequestListVisibilityOnResize"; */
/*   const [hide, setHide] = useState(false); */
/*   useRequestLisVisibilityOnResize(setHide); */

const AdminPage = () => {
  const navigate = useNavigate();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);

  if (selectedSidebarItem === "logout") {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const components = {
    "users": <UserList />,
    "teams": <TeamList />,
  };

  return(
      <div className="flex h-screen overflow-hidden">
        <Sidebar setSelectedSidebarItem={setSelectedSidebarItem} />
        <div>
          {components[selectedSidebarItem]}
        </div>
        <AdminsPendingRequests />
      </div>
  );
}
export default AdminPage;
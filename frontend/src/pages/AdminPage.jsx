import React from "react";
import Sidebar from "../components/common/navigation/Sidebar";
import { Outlet } from "react-router-dom";
import AdminsPendingRequests from "../components/ui/request/AdminsPendingRequests";

/* *** ADD FOR RESPONSIVENESS *** */
/* import { useRequestLisVisibilityOnResize } from "../hooks/useRequestListVisibilityOnResize"; */
/*   const [hide, setHide] = useState(false); */
/*   useRequestLisVisibilityOnResize(setHide); */

const AdminPage = () => {
  return(
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Outlet />
      <AdminsPendingRequests />
    </div>
  );
}
export default AdminPage;
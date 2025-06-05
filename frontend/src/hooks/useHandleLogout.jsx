import { useEffect } from "react";
import UserService from "../service/UserService";
import { useNavigate } from "react-router-dom";

export const useHandleLogout = (activeComponent) => {
  const nav = useNavigate();

  useEffect(() => {
    if(activeComponent === 'logout') {
      const refreshToken = localStorage.getItem("refreshToken");

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      UserService.logout(refreshToken).catch((error) => {
        console.log("Logout error: ", error);
      });

      nav('/login');
    }
  }, [activeComponent, nav]);

}
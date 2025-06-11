import { useEffect } from "react";
import AuthService from "../service/AuthService";
import { useNavigate } from "react-router-dom";

export const useHandleLogout = (activeComponent) => {
  const nav = useNavigate();

  useEffect(() => {
    if(activeComponent === 'logout') {
      const refreshToken = localStorage.getItem("refreshToken");

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      AuthService.logout(refreshToken).catch((error) => {
        console.log("Logout error: ", error);
      });

      nav('/login');
    }
  }, [activeComponent, nav]);

}
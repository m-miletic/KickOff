import React, { createContext, useEffect, useState } from "react";
import AuthService from "../service/AuthService";

export const AuthContext = createContext(); // should be null value as default according to react docs


export const AuthProvider = ({ children }) => {
  // !! ako token postoji vrati true inace false
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  // ako je value od key-a = 'ADMIN' true inace false
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'ADMIN');

  // refresh authentication state
  const refreshAuthState = () => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setIsAdmin(AuthService.isAdmin());
  };

  // how does useEffect work
  useEffect(() => {
    refreshAuthState();
  }, []);

  return(
      // general definition -> SomeContext.Provider lets you provide the context value to components.
      // AuthContext.Provider: Makes the context values available to all child components.
      // (isAuthenticated, isAdmin, refreshAuthState)
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, refreshAuthState }}>
        { children }
    </AuthContext.Provider>
  );
}

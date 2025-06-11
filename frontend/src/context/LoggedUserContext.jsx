import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const LoggedUserContext = createContext();

const LoggedUserProvider = ({ children }) => {
  const [jwt, setJwt] = useState(null);
  const [decodedJwt, setDecodedJwt] = useState(null);
  const [loading, setLoading] = useState(true);

  const setTokenFromLogin = (token) => {
    try {
      const decoded = jwtDecode(token);
      setJwt(token);
      setDecodedJwt(decoded);
    } catch (error) {
      console.error("Invalid token from login:", error);
      setJwt(null);
      setDecodedJwt(null);
    }
  };
  
  useEffect(() => {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      try {
        const decodedToken = jwtDecode(jwt);
        setJwt(jwt);
        setDecodedJwt(decodedToken);
      } catch (error) {
        setDecodedJwt(null);
        throw error;
      }
    } else {
      setJwt(null);
      setDecodedJwt(null);
    }

    setLoading(false);
  }, []);
  
  return(
    <LoggedUserContext.Provider value={{ decodedJwt, jwt, loading, setTokenFromLogin, setJwt, setDecodedJwt }} >
      {children}
    </LoggedUserContext.Provider>
  );
};

export { LoggedUserContext, LoggedUserProvider };
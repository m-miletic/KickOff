import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const LoggedUserContext = createContext();

const LoggedUserProvider = ({ children }) => {
  const [decodedJwt, setDecodedJwt] = useState(null);
  const [loading, setLoading] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDecodedJwt(decodedToken);
      } catch (error) {
        console.log("Invalid JWT: ", error);
        setDecodedJwt(null);
      }
    }
    setLoading(false);
  }, []);
  
  return(
    <LoggedUserContext.Provider value={{ decodedJwt, loading }} >
      {children}
    </LoggedUserContext.Provider>
  );
};

export { LoggedUserContext, LoggedUserProvider };
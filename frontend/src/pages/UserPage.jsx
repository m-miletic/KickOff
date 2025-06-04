import { useContext, useEffect } from "react";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/Standings";
import { apiAuthClient } from "../service/apis/apiClient";
import { LoggedUserContext } from "../context/LoggedUserContext";

const UserPage = () => {
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);

  console.log("UserPage: ", decodedJwt);


  useEffect(() => {
    const verifyUserRole = async () => {
      console.log("verifyUserRole - executed")
      try {
        const response = await apiAuthClient.get(`/users/me/${decodedJwt.userId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        const actualRole = response.data.role;

        if (decodedJwt.role !== actualRole) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = "/login";
        }
      } catch (error) {
        console.log("decodedjwt odavdlen: ", decodedJwt)
        console.log("Error verifying user role: ", error);
        // If the request fails (e.g. 401), logout anyway
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = "/login";
      }
    };

    verifyUserRole();

    const interval = setInterval(() => {
      verifyUserRole();
    }, 10000);

    return () => clearInterval(interval);

  }, [jwt, decodedJwt]);

  return(
    <div>
      <Navbar />
      <div className="flex justify-center pt-32"><Standings /></div>
    </div>
  );

};
export default UserPage;
import { useEffect } from "react";
import { apiAuthClient } from "../service/apis/apiClient";

const useRoleVerification = (decodedJwt, jwt) => {
  useEffect(() => {
    if (!jwt || !decodedJwt?.userId) return;

    const verifyUserRole = async () => {
      console.log("verifyUserRole executed")
      try {
        const response = await apiAuthClient.get(`/users/me/${decodedJwt.userId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        const actualRole = response.data.role;
        if (decodedJwt.role !== actualRole) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    };

    verifyUserRole();
    const interval = setInterval(() => {
      verifyUserRole();
    }, 10000); // 10 sekundi u testnoj fazi - kasnije stavit npr svako 6 ili 12 sati

    return () => clearInterval(interval);
  }, [decodedJwt, jwt]);
}

export default useRoleVerification;
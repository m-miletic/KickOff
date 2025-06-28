import React, { useContext } from "react";
import { LoggedUserContext } from "../../../context/LoggedUserContext";

const AnsweredRequests = () => {

  const { decodedJwt } = useContext(LoggedUserContext)

  return(
    <div>

    </div>
  );
}
export default AnsweredRequests;
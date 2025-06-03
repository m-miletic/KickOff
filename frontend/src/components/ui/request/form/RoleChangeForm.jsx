import React, { useState } from "react";
import { createRoleChangeRequest } from "../../../../service/requestService";

export const RoleChangeForm = ({ role, requesterId, setIsRequestModalOpen }) => {
  const [requestObject, setRequestObject] = useState({
    desiredRole: '',
    requesterId: requesterId
  });

  let roles = [];
  if (role === 'USER') {
    roles = ["TEAM_REPRESENTATIVE", "TOURNAMENT_ORGANIZER"]
  } else if (role === 'TEAM_REPRESENTATIVE') {
    roles = ["TOURNAMENT_ORGANIZER"]
  } else if (role === "TOURNAMENT_ORGANIZER") {
    roles = ["TEAM_REPRESENTATIVE"]
  }

  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectRole = (e) => {
    setRequestObject((prevValues) => ({
      ...prevValues,
      desiredRole: e.target.value
    }));
  };

  const handleSendRequest = async () => {
    try {
      const response = await createRoleChangeRequest(requestObject);
      console.log("response - ", response);
      setIsRequestModalOpen(false);
      return response;
    } catch (error) {
      setErrorMessage(error);
    }
  };

/*   console.log("role: ", role);
  console.log("requestObject: ", requestObject);
  console.log("roles: ", roles); */

  return(
    <div>

      <div className="flex items-center justify-between"> 
        <div className='w-32'>Select a role</div>
        <div>
          <select
            className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
            name=""
            id=""
            onChange={handleSelectRole}
            value={requestObject.desiredRole}
          >
            <option value={''} disabled>--- Select a role ---</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="py-3 flex items-center text-xs">
        <div className="w-32"><button onClick={handleSendRequest} className="bg-blue-600 px-2 py-1.5 rounded-lg text-white hover:bg-blue-700 cursor-pointer">Send</button></div>
        <div className="w-64 text-center text-red-600">{errorMessage}</div>
      </div>

    </div>
  );
}
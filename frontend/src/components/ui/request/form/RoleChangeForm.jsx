import React, { useContext, useState } from "react";
import { createRoleChangeRequest } from "../../../../service/requestService";
import { ALLOWED_ROLES_CHANGE_LIST } from "../../../../data/roleChangeList";
import { LoggedUserContext } from "../../../../context/LoggedUserContext";

export const RoleChangeForm = ({ setIsRequestModalOpen }) => {
  const { decodedJwt } = useContext(LoggedUserContext);
  const [requestObject, setRequestObject] = useState({
    desiredRole: '',
    requesterId: decodedJwt.userId
  });

  const roles = ALLOWED_ROLES_CHANGE_LIST[decodedJwt?.role] ?? [];

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
      setIsRequestModalOpen(false);
      return response;
    } catch (error) {
      setErrorMessage(error);
    }
  };

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
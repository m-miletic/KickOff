import React, { useState } from "react";
import { createTeamRegistrationRequest } from "../../../../service/requestService";

const RegisterTeamForm = ({ requesterId, setIsRequestModalOpen }) => {

  const [teamObject, setTeamObject] = useState({
    teamRepresentativeId: requesterId,
    teamName: "",
    coach: ""
  });

  const [errorMessage, setErrorMessage] = useState("");


  const handleSendRequest = async () => {
    try {
      const response = await createTeamRegistrationRequest(teamObject);
      console.log("response: ", response);
      setIsRequestModalOpen(false);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleChange = (e) => {
    setTeamObject((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  return(
    <div>

      <div className='flex items-center px-5 py-3 text-xs'>
        <div className='w-32'>Team Name</div>
        <input
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          type="text"
          name="teamName"
          value={teamObject.teamName}
          onChange={handleChange}
        />
      </div>

      <div className='flex items-center px-5 py-3 text-xs'>
        <div className="w-32">Coach</div>
        <input
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          type="text"
          name="coach"
          value={teamObject.coach}
          onChange={handleChange}
        />
      </div>

      <div className="px-4 py-3 flex items-center text-xs">
        <div className="w-32"><button onClick={handleSendRequest} className="bg-blue-600 px-2 py-1.5 rounded-lg text-white hover:bg-blue-700 cursor-pointer">Send</button></div>
        <div className="w-64 text-center text-red-600">{errorMessage}</div>
      </div>

    </div>
  );
}
export default RegisterTeamForm;
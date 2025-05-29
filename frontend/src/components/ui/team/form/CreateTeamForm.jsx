import React, { useState } from "react";
import { createTeam } from "../../../../service/teamService";

const CreateTeamForm = ({ setIsModalOpen, selectedRequest, decodedJwt  }) => {

  const [teamObject, setTeamObject] = useState({
    teamName: '',
    coach: '',
    requestId: selectedRequest.id,
    representativeId: decodedJwt.userId
  });

  console.log("Selected Request: ", selectedRequest);

  const handleInputChange = (e) => {
    setTeamObject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const handleCreateButtonClick = async () => {
    createTeam(teamObject);
    setIsModalOpen(false);
  };

  return(
    <div className='text-black w-[400px]'>

      <div className="flex items-center p-4 space-x-1">
        <div className="w-24">
          <span className="text-sm">Team Name</span>
        </div>
        <div>
          <input
            type="text"
            name="teamName"
            className="text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded"
            onChange={handleInputChange}  
            placeholder="enter team name"
          />
        </div>
      </div>

      <div className="flex items-center p-4 space-x-1">
        <div className="w-24"> 
          <span className="text-sm">Coach</span>
        </div>
        <div>
          <input
            type="text"
            name="coach"
            className="text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded"
            onChange={handleInputChange}  
            placeholder="enter coach"
          />
        </div>
      </div>
      
      <div className="p-3">
        <button onClick={() => handleCreateButtonClick()} className="bg-blue-700 rounded-lg p-1 text-sm text-white">Create</button>
      </div>

    </div>
  );
}
export default CreateTeamForm;
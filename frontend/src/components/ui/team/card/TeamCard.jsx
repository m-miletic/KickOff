import React, { useState } from "react";
import { deleteTeamById } from "../../../../service/teamService";
import { toast } from "react-toastify";

const TeamCard = ({ team, setTeams }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const handleDeleteTeam = async () => {
    try {
      const response = await deleteTeamById(team.id)
      if (response.success) {
        setTeams((prevTeams) =>({
          prevTeams: prevTeams.filter(t => t.id !== team.id)
        }))
        toast.success("Team Deleted!", {
          autoClose: 2000
        })
      }
    } catch (error) {
      setDeleteErrorMessage(error.dta.message)
    }
  }


  return (
    <div className="bg-[#001E30] rounded-md px-6 py-8 min-h-[150px] min-w-[300px] text-white shadow-md flex flex-col items-start h-auto self-start w-full space-y-2">

      {showDeleteConfirmation ? (
        <div>
          Are You Sure?
          <div className="flex justify-start items-center space-x-2 py-3">
            <button onClick={handleDeleteTeam} className="border border-gray-400 px-4 py-1 rounded-lg">Yes</button>
            <button onClick={() => setShowDeleteConfirmation(false)} className="border border-gray-400 px-4 py-1 rounded-lg">Cancel</button>
          </div>
          {deleteErrorMessage && (
            <div className="text-red-500 pt-2">{deleteErrorMessage}</div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <div>Team Name:</div>
            <div>{team.teamName}</div>
          </div>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-lg mt-2"
          >
            Delete Team
          </button>
        </>
      )}
      
    </div>
  );
}
export default TeamCard;
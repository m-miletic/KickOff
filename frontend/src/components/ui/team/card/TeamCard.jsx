import React, { useEffect, useState } from "react";
import { deleteTeamById, fetchTeams } from "../../../../service/teamService";
import { toast } from "react-toastify";

const TeamCard = ({ team, setTeams, filters, setTotalPages }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const reFetch = async () => {
    try {
      const response = await fetchTeams(filters);
      setTeams(response.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await deleteTeamById(team.id)
      if (response.success) {
        toast.success("Team Deleted!", {
          autoClose: 2000
        })
        reFetch();
      }
    } catch (error) {
      setDeleteErrorMessage(error.dta.message)
    }
  };


  return (
    <div className="bg-[#001E30] rounded-md px-6 py-8 min-h-[160px] min-w-[360px] text-white shadow-md flex flex-col items-start h-auto self-start w-full space-y-2">

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
          <div className="flex justify-between items-center w-full text-lg">
            <div className="text-xl">Team Name:</div>
            <div className="font-bold">{team.teamName}</div>
          </div>
          <div>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 text-lg rounded-lg mt-6"
            >
              Delete Team
            </button>
          </div>
        </>
      )}
      
    </div>
  );
}
export default TeamCard;
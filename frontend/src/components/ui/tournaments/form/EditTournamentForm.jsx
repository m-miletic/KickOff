import React, { useState } from "react";
import { deactivateTournament, removeTeamFromTournament, updateTournament } from "../../../../service/tournamentService";
import { toast } from "react-toastify";

const EditTournamentForm = ({ tournament, setTournament }) => {
  const [editTournamentFormData, setEditTournamentFormData] = useState(tournament);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [validationErrors, setValidationErrors] = useState("");

  const [showEndTournamentDialog, setShowEndTournamentDialog] = useState(false)

  const handleUpdateTournament = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTournament(tournament.id, editTournamentFormData);
  
      if (response.success === true) {
        setTournament(response.data);
        toast.success("Tournament Updated!", {
          autoClose: 2500
        });
        setValidationErrors("");
      }
    } catch (error) {
      setValidationErrors(error.data)
      toast.error(error.data, {
        autoClose: 2500
      })
    }
  };

  const handleInputChange = (e) => {
    setEditTournamentFormData((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleKickTeam = async (teamId) => {
    try {
      const response = await removeTeamFromTournament(teamId)
      const kickedTeam = response.data;
      setTournament((prevTournament) => ({
        ...prevTournament,
        teams: prevTournament.teams.filter((team) => team.id !== kickedTeam.id)
      }))
      if (response.success === true) {
        toast.success("Team Kicked From Tournament", {
          autoClose: 2500
        })
      }
    } catch (error) {
      if (error.data.message) {

      } else if (error.data) {
        setValidationErrors(error.data)
      }
    }
  };

  const handleDeactivateTournament = async (id) => {
    try {
      const response = await deactivateTournament(id)
      setTournament(null)
      if (response.success === true) {
        toast.success("Tournament Deactivated!", {
          autoClose: 2500
        })

        localStorage.setItem("activeComponent", "tournamentOverview");

        setTimeout(() => {
          window.location.reload()
        }, 500);
      }
    } catch (error) {
      console.log("Error in deactivate tournament: ", error)
    }
  }

  return(
    <div className="bg-[#001E28] rounded-lg p-4  mx-auto shadow-lg lg:w-[600px] xl:w-[750px] 2xl:w-[870px] sm:p-6">
      {tournament && (
        <>
          <form onSubmit={handleUpdateTournament} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block mb-1 font-semibold text-lg sm:text-lg">
                Tournament Name:
              </label>
              <input
                type="text"
                name="tournamentName"
                value={editTournamentFormData.tournamentName || ""}
                onChange={handleInputChange}
                className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
              />
            </div>
            {validationErrors?.tournamentName && (
              <div className='flex'>
                <div className="text-red-500 text-xs mt-1">
                  {validationErrors?.tournamentName} 
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1 font-semibold text-lg sm:text-lg">
                Details:
              </label>
              <input
                type="text"
                name="details"
                value={editTournamentFormData.details || ""}
                onChange={handleInputChange}
                className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-lg sm:text-lg">
                Max. Teams Allowed:
              </label>
              <input
                type="number"
                name="maxTeams"
                value={editTournamentFormData.maxTeams || ""}
                onChange={handleInputChange}
                className="w-24 text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
              />
            </div>
            {validationErrors?.maxTeams && (
              <div className='flex'>
                <div className="text-red-500 text-xs mt-1">
                  {validationErrors?.maxTeams} 
                </div>
              </div>
            )}

            <label className="block mb-1 font-semibold text-[0.75rem] sm:text-lg">
                Enrolled Teams:
              </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournament?.teams?.length > 0 ? (
                tournament?.teams?.map((team) => (
                  <div
                    key={team.id}
                    className="bg-[#00303f] rounded-lg flex flex-col justify-between items-center shadow-md h-[65px] w-[275px]" // fix height
                  >
                    {showDeleteConfirmation === team.id ? (
                      <div className="flex justify-between items-center w-full h-full px-4">
                        <div className="text-white text-sm">Are you sure?</div>
                        <div className="flex justify-end space-x-2 ml-4">
                          <div>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              onClick={() => handleKickTeam(team.id)}
                            >
                              Yes
                            </button>
                          </div>

                          <div>
                            <button
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                              onClick={() => setShowDeleteConfirmation(null)}
                            >
                              Cancel
                            </button>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full h-full px-4">
                        <div className="text-white">{team.teamName}</div>
                        <div>
                          <button
                            onClick={() => setShowDeleteConfirmation(team.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Kick
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-white">No teams enrolled yet</div>
              )}
            </div>

            <div className="flex space-x-3 sm:space-x-6">

              <div className="flex-1">
                <label className="block mb-1 font-semibold text-[0.75rem] sm:text-lg">
                  Start Date:
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={editTournamentFormData.startDate || ""}
                  onChange={handleInputChange}
                  className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1 font-semibold text-[0.75rem] sm:text-lg">
                  End Date:
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={editTournamentFormData.endDate || ""}
                  onChange={handleInputChange}
                  className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
                />
              </div>

            </div>

            {validationErrors?.startDate && (
                <div className='flex'>
                  <div className="text-red-500 text-xs mt-1">
                    {validationErrors?.startDate} 
                  </div>
                </div>
              )}
              {validationErrors?.endDate && (
                <div className='flex'>
                  <div className="text-red-500 text-xs mt-1">
                    {validationErrors?.endDate} 
                  </div>
                </div>
              )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md py-2 text-sm font-semibold text-white sm:py-3 sm:text-base"
            >
              Save
            </button>  
          </form>
{/*           <div>
          {showEndTournamentDialog ? (
            <div className="flex justify-between bg-[#00303f] py-4 rounded-md px-10 mt-10">
              <div>Confirm Deactivating Tournament</div>
              <div className="flex justify-center items-center space-x-2">
                <div className="bg-red-600 hover:bg-red-700 rounded-md px-2 py-1 font-semibold"><button onClick={() => handleDeactivateTournament(tournament.id)}>Deactivate</button></div>
                <div className="bg-gray-600 hover:bg-gray-700 rounded-md px-2 py-1 font-semibold"><button onClick={() => setShowEndTournamentDialog(false)}>Cancel</button></div>
              </div>
            </div>
          ) : (
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-md py-2 text-sm font-semibold text-white sm:py-3 sm:text-base mt-10"
            onClick={() => setShowEndTournamentDialog(true)}
            >
            End Tournament
          </button>
          )}
          </div> */}
        </>
      )}
  </div>
  );
}
export default EditTournamentForm;
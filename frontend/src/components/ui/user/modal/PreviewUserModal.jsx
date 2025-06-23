import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { getTeamByTeamRepresentative } from "../../../../service/teamService";
import { fetchOrganizersTournament } from "../../../../service/tournamentService";

export const PreviewUserModal = ({ setIsModalOpen, selectedUser: user }) => {

  const [team, setTeam] = useState({})
  const [tournament, setTournament] = useState({})
  const [errorMessage, setErrorMessage] = useState("")

  // vec san ima gotove funkcije u servisu, nisan tia davat useru vezu na tim i turnir, cinimise da mi je to vise posla..ovako priko user id-a dodem do njegovog tima/turnira
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === "TEAM_REPRESENTATIVE") {
          const response = await getTeamByTeamRepresentative(user.id)
          setTeam(response.data)
        } else if (user.role === "TOURNAMENT_ORGANIZER") {
          const response = await fetchOrganizersTournament(user.id)
          setTournament(response.data)
        }
      } catch (error) {
        console.error("Error while fetching data: ", error.data.message)
        setErrorMessage(error.data.message)
      }
    }

    fetchData()
  }, [user])

  return(
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
      <div className='bg-white text-gray-800 rounded-lg shadow-sm w-auto py-2 px-6'>

        <div className='flex items-center justify-between py-4 border-b border-gray-500 rounded-t text-black'>
          <h3 className='text-lg'>Preview User</h3>
          <button onClick={() => setIsModalOpen(false)} className='hover:bg-gray-200 p-1.5 rounded-lg'>
            <IoMdClose className='w-4 h-4'/>
          </button>
        </div>

        <div className="p-3 flex justify-start items-center">
          <div className="w-24">Username:</div>
          <div className="ml-2">{user.username}</div>
        </div>

        <div className="p-3 flex justify-start items-center">
          <div className="w-24">Role:</div>
          <div className="ml-2"> {user.role.toLowerCase()}</div>
        </div>

        {/* ako nije team rep. nemoj niti pokazat ovaj dio ako je i ne predtavlja tim ispisi upozorenje */}
        {user.role === "TEAM_REPRESENTATIVE" && (
          <div className="p-3">
            {team?.teamName ? (
              <div>
                <div>Team Representing:</div>
                <div>{team.teamName}</div>
              </div>
            ) : (
              <div className="text-black">{errorMessage}</div>
            )}
          </div>
        )}

        {/* ako nije tourn. org. nemoj niti pokazat ovaj dio ako je i ne host-a turnir ispisi upozorenje */}
        {user.role === "TOURNAMENT_ORGANIZER" && (
          <div className="p-3">
            {tournament?.tournamentName ? (
              <div>
                <div>Tournament Hosting:</div>
                <div>{tournament.tournamentName}</div>
              </div>
            ) : (
              <div className="text-black">{errorMessage}</div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
export default PreviewUserModal;
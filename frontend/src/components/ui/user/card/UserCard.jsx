import React, { useEffect, useState } from "react";
import { getTeamByTeamRepresentative } from "../../../../service/teamService";
import { fetchOrganizersTournament } from "../../../../service/tournamentService";
import { deleteUser } from "../../../../service/usersService";

const UserCard = ({ user, setUsers }) => {

  const [team, setTeam] = useState({})
  const [tournament, setTournament] = useState({})
  const [errorMessage, setErrorMessage] = useState("")

  const [deleteErrorMessage, setDeleteErrorMessage] = useState("")

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

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
        const message = error?.response?.data?.message || error.message || "Error while fetching data";
        setErrorMessage(message);
      }
    }

    fetchData()
  }, [user])


  const handleDeleteUser = async () => {
    try {
      const response = await deleteUser(user.id);
      const deletedUser = response.data;
      setUsers((prevUsers) => ({
        ...prevUsers,
        usersList: prevUsers.usersList.filter((u) => u.id !== deletedUser.id),
      }));
    } catch (error) {
      console.log("Delete Error: ", error);
      setDeleteErrorMessage(error.data.message); 
    }
  };
  

  console.log("errorMessage: ", errorMessage)

  return (

    <div className="bg-[#001E30] rounded-md px-6 py-8 min-h-[150px] min-w-[300px] text-white shadow-md flex flex-col items-start h-auto self-start w-full space-y-1">

    {showDeleteConfirmation ? (
      <div>
        Are You Sure?
        <div className="flex justify-start items-center space-x-2 py-3">
          <div>
            <button onClick={handleDeleteUser} className="border border-gray-400 px-4 py-1 rounded-lg">Yes</button>
          </div>
          <div>
            <button onClick={() => setShowDeleteConfirmation(false)} className="border border-gray-400 px-4 py-1 rounded-lg">Cancel</button>
          </div>
        </div>
        {deleteErrorMessage && (
          <div className="text-red-500 pt-2">{deleteErrorMessage}</div>
        )}
      </div>
    ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <div>Username: </div>
            <div>{user.username}</div>
          </div>

          <div className="flex justify-between items-center w-full">
            <div>Role: </div>
            <div>{user.role.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
          </div>

          {user.role === "TEAM_REPRESENTATIVE" && (
              <div className="pt-3">
                {team?.teamName ? (
                  <div>
                    <div>Team Representing:</div>
                    <div>{team.teamName}</div>
                  </div>
                ) : (
                  <div>Not representing team</div>
                )}
              </div>
            )}

            {user.role === "TOURNAMENT_ORGANIZER" && (
              <div className="text-white">
                {tournament?.tournamentName ? (
                  <div className="pt-3">
                    <div>Tournament Hosting:</div>
                    <div>{tournament.tournamentName}</div>
                  </div>
                ) : (
                  <div>{errorMessage}</div>
                )}
              </div>
            )}

            <div>
              <button onClick={() => setShowDeleteConfirmation(true)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-lg mt-1">Delete User</button>
            </div>
          </>
        )}

    
    </div>
  );
}
export default UserCard;
import React from "react";
import { deletePlayer } from "../../../service/playerService";

const DeletePlayerForm = ({ selectedPlayer, setShowDeleteConfirmation, setTeam }) => {

  const confirmDeletePlayer = async (playerId) => {
    const response = await deletePlayer(playerId)
    const deletedPlayer = response.data
    setTeam((prevTeam) => ({
      ...prevTeam,
      players: prevTeam.players.filter(player => player.id !== deletedPlayer.id)
    }));
  };

  return (
    <div className="flex flex-col items-center w-full space-y-2 h-[200px] justify-center">
      <span className="text-white font-medium">Delete player?</span>
      <div className="flex space-x-2">
        <button
          onClick={() => confirmDeletePlayer(selectedPlayer.id)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
        >
          Yes
        </button>
        <button
          onClick={() => setShowDeleteConfirmation("")}
          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
        >
          No
        </button>
      </div>
    </div>
);

}
export default DeletePlayerForm;
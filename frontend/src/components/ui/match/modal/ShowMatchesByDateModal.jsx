import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { deleteMatch } from "../../../../service/matchService";
import EditMatchForm from "../form/EditMatchForm";

const ShowMatchesByDateModal = ({ matches, closeModal }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [clickedMatch, setClickedMatch] = useState(null);

  console.log("matches: ", matches)

  const handleShowDeleteDialog = (match) => {
    setShowDeleteDialog(!showDeleteDialog);
    setClickedMatch(match);
  };

  const handleShowEditForm = (match) => {
    setClickedMatch(match);
    setShowEditForm(true);
  };


  // dovršit implementaciju za slučaj kada triba obrisat - prilikom brisanja osvjezit trenutne grupirane meceve (u roditeljskoj komponenti?) kako bi dobio na real-time dojmu uklanjanja
  const handleDelete = (action) => {
    if (!action) {
      setShowDeleteDialog(!showDeleteDialog);
    } else {
      deleteMatch(clickedMatch);
    }
  };


  return(
    <div className="absolute bg-gray-50 top-[100px] left-[35%] z-10 rounded-md pb-1">

      <div className="flex justify-between items-center space-x-36 px-4 pt-5">
        <div className="text-2xl font-bold">Matches on this day</div>
        <div onClick={closeModal} className="hover:bg-gray-200 p-2 rounded-md cursor-pointer"><IoMdClose /></div>
      </div>

      <div className="border p-2 m-4 max-h-[350px] min-w-[600px] overflow-y-auto text-lg">
        {matches.map((match) => (
          (match.id === clickedMatch?.id) && showEditForm ? (
            <EditMatchForm match={match} closeEditForm={() => setShowEditForm(false)} />
          ) : (
          <div id={match.id} className="mb-6 mx-2">

            <div>
              <span className="font-bold">{match.name}</span>
              {match.homeTeamGoals === null || match.awayTeamGoals === null ? (
                <span className="text-gray-400 font-semibold mx-5">No results yet</span>
              ) : (
                <span>{match.homeTeamGoals}:{match.awayTeamGoals}</span>
              )}
              
            </div>

            <div>
              <span className="text-gray-600 font-semibold ">{match.matchDate.slice(8,10)}/{match.matchDate.slice(5,7)}/{match.matchDate.slice(2,4)} {match.matchDate.slice(11,16)}h</span>
            </div>

            <div>
              <span className="text-gray-600 font-semibold ">Stadion</span>
            </div>

            <div className="space-x-4">
              { (match.id === clickedMatch?.id) && showDeleteDialog ? (
                <div className="pb-4">
                  <div className="text-black font-bold">Are you sure?</div>
                  <div className="space-x-4">
                    <button onClick={() => handleDelete(true)} className="px-5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md">Delete</button>
                    <button onClick={() => handleDelete(false)} className="px-5 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => handleShowDeleteDialog(match)} className="bg-red-600 hover:bg-red-700 px-2 py-1 text-white font-semibold mt-1 rounded-md">Delete</button>
                  <button onClick={() => handleShowEditForm(match)} className="bg-blue-600 hover:bg-blue-700 px-4 py-1 text-white font-semibold mt-1 rounded-md">Edit</button>
                </>
              )}
            </div>

          </div>
          )

        ))}
      </div>

    </div>
  );
}
export default ShowMatchesByDateModal;
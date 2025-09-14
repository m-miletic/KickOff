import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { deleteMatch } from "../../../../service/matchService";
import EditMatchForm from "../form/EditMatchForm";

const ShowMatchesByDateModal = ({ matches, setMatches, setClickedDateMatches, closeModal }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [clickedEditMatch, setClickedEditMatch] = useState(null);
  const [clickedDeleteMatch, setClickedDeleteMatch] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(null);

  const handleShowDeleteDialog = (match) => {
    setClickedDeleteMatch(match);
    setShowDeleteDialog(true);
    setShowEditForm(false);
  };

  const handleShowEditForm = (match) => {
    setClickedEditMatch(match);
    setShowEditForm(true);
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    const updateTime = () => {
      const newDate = new Date();
      setCurrentDateTime(
        `${String(newDate.getFullYear())}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}T${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}`
      );
    }

    updateTime();
  }, []); 

  // dovršit implementaciju za slučaj kada triba obrisat - prilikom brisanja osvjezit trenutne grupirane meceve (u roditeljskoj komponenti?) kako bi dobio na real-time dojmu uklanjanja
  const handleDelete = async (action) => {
    if (!action) {
      setShowDeleteDialog(!showDeleteDialog);
    } else {
      const response = await deleteMatch(clickedDeleteMatch.id);
      if (response.success) {
        setClickedDateMatches(prevValues => prevValues.filter(match => match.id !== clickedDeleteMatch.id)); // za uklanjanje iz liste (modal)
        setMatches(prevValues => prevValues.filter(match => match.id !== clickedDeleteMatch.id)); // za uklanjanje iz kalendara
      }
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
          (match.id === clickedEditMatch?.id) && showEditForm ? (
            <EditMatchForm match={match} setClickedDateMatches={setClickedDateMatches} closeEditForm={() => setShowEditForm(false)} currentDateTime={currentDateTime} />
          ) : (
          <div id={match.id} className="mb-6 mx-2">

            <div>
              <span className="font-bold">{match.name}</span>
              {match.homeTeamGoals === null || match.awayTeamGoals === null ? (
                <span className="text-gray-400 font-semibold mx-5">No results yet</span>
              ) : (
                <span className="ml-6 font-bold">{match.homeTeamGoals}:{match.awayTeamGoals}</span>
              )}
              
            </div>

            <div>
              <span className="text-gray-600 font-semibold ">{match.matchDate.slice(8,10)}/{match.matchDate.slice(5,7)}/{match.matchDate.slice(2,4)} {match.matchDate.slice(11,16)}h</span>
            </div>

            <div>
              <span className="text-gray-600 font-semibold ">
                {match.stadium.stadiumName}
              </span>
            </div>

            <div className="space-x-4">
              { (match.id === clickedDeleteMatch?.id) && showDeleteDialog ? (
                <div className="pb-4">
                  <div className="text-black font-bold">Are you sure?</div>
                  <div className="space-x-4">
                    <button onClick={() => handleDelete(true)} className="px-5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md">Delete</button>
                    <button onClick={() => handleDelete(false)} className="px-5 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {currentDateTime < match.matchDate && (
                    <button onClick={() => handleShowDeleteDialog(match)} className="bg-red-600 hover:bg-red-700 px-2 py-1 text-white font-semibold mt-1 rounded-md">Delete</button>
                  )}
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
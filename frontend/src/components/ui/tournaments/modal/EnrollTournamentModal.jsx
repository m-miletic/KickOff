import React, { useContext, useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { createEnrollTeamRequest } from '../../../../service/requestService';
import { LoggedUserContext } from '../../../../context/LoggedUserContext';
import { fetchMyData } from '../../../../service/usersService';

const EnrollTournamentModal = ({ setIsModalOpen, selectedTournament: tournament }) => {

  const { decodedJwt } = useContext(LoggedUserContext);

  // provjerit zastupa li tim neki ako nije ne dat mu opciju enroll
  // fali sa backenda naprvit dto di posalje i team koji zastupa

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await fetchMyData(decodedJwt.userId);
      } catch (error) {
        throw error;
      }
    }

    fetchMyInfo();
  }, [])


  console.log("a : ", decodedJwt)

  const [errorMessage, setErrorMessage] = useState(null);
  const [requestObject, setRequestObject] = useState({
    teamRepresentativeId: decodedJwt.userId,
    tournamentId: tournament.id,
  });



  const handleEnrollButtonClick = async () => {
    try {
      const response = await createEnrollTeamRequest(requestObject);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
  
      {/* Modal content */}
      <div className="relative bg-white text-gray-800 rounded-lg shadow-lg w-[400px] z-10">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="text-lg font-medium">Tournament Overview</h3>
          <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-200 p-1.5 rounded-lg">
            <IoMdClose className="w-4 h-4" />
          </button>
        </div>
  
        <div className="p-4 text-sm space-y-3 px-10">
          <div className="flex justify-between">
            <div className="font-medium">Tournament Name:</div>
            <div>{tournament.tournamentName}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Start Date:</div>
            <div>{tournament.startDate}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">End Date:</div>
            <div>{tournament.endDate}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Description:</div>
            <div>{tournament.details}</div>
          </div>
  
          <div className="flex justify-center mt-4">
            {errorMessage ? (
              <span className="text-red-600">{errorMessage}</span>
            ) : (
              <button
                onClick={handleEnrollButtonClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit Enrollment Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}
export default EnrollTournamentModal;

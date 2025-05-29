import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { createEnrollTeamRequest } from '../../../../service/requestService';

const EnrollTournamentModal = ({ setIsModalOpen, selectedTournament: tournament, decodedJwt }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestObject, setRequestObject] = useState({
    teamRepresentativeId: decodedJwt.userId,
    tournamentId: tournament.id,
  });

  console.log("TEST - ", tournament.userEnrolled)

  const handleEnrollButtonClick = async () => {
    try {
      const response = await createEnrollTeamRequest(requestObject);
      console.log("response -> ", response);
      setIsModalOpen(false);
    } catch (error) {
      console.log("error.response.data.message: ", error.response.data.message)
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
      <div className='bg-white text-gray-800 rounded-lg shadow-sm w-[400px]'>
        
        <div className='flex items-center justify-between p-4 border-b border-gray-500 rounded-t text-black'>
          <h3 className='text-lg'>Preview Tournament</h3>
          <button onClick={() => setIsModalOpen(false)} className='hover:bg-gray-200 p-1.5 rounded-lg'>
            <IoMdClose className='w-4 h-4'/>
          </button>
        </div>

        <div className='text-black text-sm p-4 space-y-3'>

          <div className='flex justify-evenly items-center'>
            <div>Tournament name </div>
            <div>{tournament.tournamentName}</div>
          </div>

          <div className='flex justify-evenly items-center'>
            <div>Start Date</div>
            <div>{tournament.startDate}</div>
          </div>

          <div className='flex justify-evenly items-center'>
            <div>End Date</div>
            <div>{tournament.endDate}</div>
          </div>

          <div className='flex justify-evenly items-center'>
            <div>Tournament details</div>
            <div>{tournament.details}</div>
          </div>

          <div className='flex justify-center mt-4'>
            <div>
              {errorMessage !== null ? (
                <span>{errorMessage}</span>
              ) : (
                <button onClick={handleEnrollButtonClick} className='border px-2 py-1 rounded-md hover:ring-1 hover:ring-black'>Enroll</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EnrollTournamentModal;

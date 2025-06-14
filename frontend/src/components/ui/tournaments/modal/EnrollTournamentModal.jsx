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

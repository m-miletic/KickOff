import React, { useState } from 'react'
import { createTournament } from '../../../../service/tournamentService';

const CreateTournamentForm = ({ setIsModalOpen, selectedRequest, decodedJwt }) => { // s {} destrukturiram props objekt -  slucaj bez {} bi izgleda setIsModalOpen.setIsModalOpen
  const [tournamentObject, setTournamentObject] = useState({
    tournamentName: '',
    startDate: null,
    endDate: null,
    details: '',
    requestId: selectedRequest.id,
    organizerId: decodedJwt.userId
  });

  console.log("selectedRequest.Id: ", selectedRequest.id);

  const handleInputChange = (e) => {
    setTournamentObject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value 
    }))
  };

  const handleCreateButtonClick = () => {
    createTournament(tournamentObject);
    setIsModalOpen(false);
  };

  console.log("tournamentObject: ", tournamentObject);


  return (
    <div className='text-black text-start text-sm space-y-4 p-2'>
      <div className='text-center'>Create a Tournament</div>

      <div className='flex items-center justify-start space-x-2'>
        <div className='w-32'>Tournament Name </div>
        <div>
          <input
            type="text" 
            name='tournamentName'
            className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
            placeholder='enter tournament name'  
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className='flex justify-start items-center space-x-5'>
        <div className='flex justify-start items-center space-x-2'>
          <div className='w-32'>Start Date </div>
          <div>
            <input
              type='date'
              name='startDate'
              className='text-xs w-32 h-8 px-2 py-1 border border-gray-300 rounded'
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className='flex justify-start items-center'>

        <div className='flex justify-start items-center space-x-2'>
          <div className='w-32'>End Date </div>
          <div>
            <input
              type='date'
              name='endDate'
              className='text-xs w-32 h-8 px-2 py-1 border border-gray-300 rounded'
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className='flex items-center justify-start space-x-2'>
        <div className='w-32'>Details</div>
        <div>
          <input 
            type='text'
            name='details'
            className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className='pt-2 flex justify-start items-center'>
        <button onClick={handleCreateButtonClick} className='bg-blue-600 text-white font-bold px-2 py-1 rounded-lg hover:bg-blue-700'>Create</button>
      </div>

    </div>
  )
}

export default CreateTournamentForm;

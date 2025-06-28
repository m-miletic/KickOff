import React, { useState } from 'react'
import { createTournament } from '../../../../service/tournamentService';
import { toast } from 'react-toastify';

const CreateTournamentForm = ({ setIsModalOpen, selectedRequest, decodedJwt }) => { // s {} destrukturiram props objekt -  slucaj bez {} bi izgleda setIsModalOpen.setIsModalOpen

  const [validationErrors, setValidationErrors] = useState({})

  const [formData, setFormData] = useState({
    tournamentName: '',
    startDate: null,
    endDate: null,
    details: '',
    requestId: selectedRequest.id,
    organizerId: decodedJwt.userId
  });

  console.log("selectedRequest.Id: ", selectedRequest.id);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value 
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createTournament(formData);  // wait for the async call
      if (response.success = true) {
        toast.success("Tournament created!", {
          autoClose: 2000
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      setValidationErrors(error.data)
      toast.error(error.data.message, {
        autoClose: 2000
      });
    }
  }


  return (
    <form onSubmit={handleSubmit} className='text-black text-start text-sm space-y-4 p-2'>
      <div className='text-center font-semibold'>Create a Tournament</div>

      {/* Tournament Name */}
      <div className='flex items-center'>
        <label htmlFor='tournamentName' className='w-32'>Tournament Name</label>
        <input
          type="text"
          id='tournamentName'
          name='tournamentName'
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          placeholder='Enter tournament name'
          onChange={handleInputChange}
          required
        />
      </div>
      {validationErrors?.tournamentName && (
        <div className='flex'>
          <div className='w-32'></div>
          <div className="text-red-500 text-xs mt-1">
            {validationErrors?.tournamentName} 
          </div>
        </div>
      )}

      {/* Start Date */}
      <div className='flex items-center'>
        <label htmlFor='startDate' className='w-32'>Start Date</label>
        <input
          type='date'
          id='startDate'
          name='startDate'
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          onChange={handleInputChange}
          required
        />
      </div>

      {/* End Date */}
      <div className='flex items-center'>
        <label htmlFor='endDate' className='w-32'>End Date</label>
        <input
          type='date'
          id='endDate'
          name='endDate'
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='flex items-center'>
        <label htmlFor='endDate' className='w-32'>Number of Teams</label>
        <input
          type='number'
          id='maxTeams'
          name='maxTeams'
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          onChange={handleInputChange}
          required
        />
      </div>
      {validationErrors?.maxTeams && (
        <div className='flex'>
          <div className='w-32'></div>
          <div className="text-red-500 text-xs mt-1">
            {validationErrors?.maxTeams} 
          </div>
        </div>
        )}

      {/* Details */}
      <div className='flex items-center'>
        <label htmlFor='details' className='w-32'>Details</label>
        <input
          type='text'
          id='details'
          name='details'
          className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
          placeholder='Optional details'
          onChange={handleInputChange}
        />
      </div>

      {/* Submit Button */}
      <div className='pt-2 flex justify-start'>
        <button type='submit' className='bg-blue-600 text-white font-bold px-3 py-1 rounded-lg hover:bg-blue-700'>
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateTournamentForm;
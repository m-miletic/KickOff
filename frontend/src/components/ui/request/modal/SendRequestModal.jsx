import React, { useContext, useState } from 'react'
import { createTeamRegistrationRequest, createTournamentCreationRequest } from '../../../../service/requestService';
import { LoggedUserContext } from '../../../../context/LoggedUserContext';
import { toast } from 'react-toastify';

export const SendRequestModal = ({ setIsRequestModalOpen }) => {
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext)

  const handleTeamRegRequest = async () => {
    try {
      await createTeamRegistrationRequest(decodedJwt.userId);
      setIsRequestModalOpen(false)
      toast.success("Team registration request sent!", {
        autoClose: 2500
      });
    } catch (error) {
      setIsRequestModalOpen(false)
      toast.error(error.data.message, {
        autoClose: 3000
      });
    }
  };
  
  const handleTournamentOrgRequest = async () => {
    try {
      const response = await createTournamentCreationRequest(decodedJwt.userId);
      if (response.success) {
        setIsRequestModalOpen(false)
        toast.success("Request to host a tournament sent!", {
          autoClose: 2500
        });
      }
    } catch (error) {
      setIsRequestModalOpen(false)
      toast.error(error.data.message, {
        autoClose: 3000,
      });
    }
  };
  
  
return ( 
  <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/40 -mt-48">
    <div className="relative p-4 w-[400px] sm:w-[450px] md:w-[450px] lg:w-[500px] xl:w-[550px] 2xl:w-[600px]">
      <div className="relative bg-gray-100 rounded-lg shadow-sm text-gray-800">

        
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-300 rounded-t">
          <h1 className='text-base'>Send Request</h1>
          <button onClick={() => setIsRequestModalOpen(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {decodedJwt.role === "TEAM_REPRESENTATIVE" && (
          <div className='px-5 py-3 text-base'>
            <div className='w-auto'>Request Approval to Create Team</div>
            <div className='py-3'><button onClick={handleTeamRegRequest} className='bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg'>Send</button></div>
          </div>
        )}

        {decodedJwt.role === "TOURNAMENT_ORGANIZER" && (
          <div className='px-5 py-3 text-base'>
            <div className='w-auto'>Request Approval to Organize a Tournament</div>
            <div className='py-3'><button onClick={handleTournamentOrgRequest} className='bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg'>Send</button></div>
          </div>
        )}

      </div>
    </div>
  </div>
)

  
}

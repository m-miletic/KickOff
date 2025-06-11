import React, { useContext, useState } from 'react'
import { RoleChangeForm } from '../form/RoleChangeForm';
import { createTeamRegistrationRequest, createTournamentCreationRequest } from '../../../../service/requestService';
import { LoggedUserContext } from '../../../../context/LoggedUserContext';
import { REQUEST_TYPES_BY_ROLE } from '../../../../data/requestTypeList';

export const SendRequestModal = ({ setIsRequestModalOpen }) => {
  const [requestType, setRequestType] = useState("");
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext)

  const [errorMessage, setErrorMessage] = useState("");

  const requestTypeList = REQUEST_TYPES_BY_ROLE[decodedJwt?.role] ?? [];

  const handleReqTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleSendTeamRegistrationRequestRequest = async () => {
    const createTeamRequestObject = {
      teamRepresentativeId: decodedJwt.userId
    }
    try {
      const response = await createTeamRegistrationRequest(createTeamRequestObject);
      setIsRequestModalOpen(false);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleSendTornamentOrganizationRequest = async () => {
    const createTournamentOrganizationRequestObject = {
      tournamentOrganizerId: requesterId
    }
    try {
      const response = await createTournamentCreationRequest(createTournamentOrganizationRequestObject);
      setIsRequestModalOpen(false);
    } catch (error) {
      setErrorMessage(error);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="relative p-4 w-[400px] sm:w-[450px] md:w-[450px] lg:w-[500px] xl:w-[550px] 2xlw-[600px]">
        <div className="relative bg-white rounded-lg shadow-sm">
          
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h1 className='text-base'>Send Request</h1>
            <button onClick={() => setIsRequestModalOpen(false)}  type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  " data-modal-hide="default-modal">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className='flex items-center px-5 py-3 text-xs'>
            <div className='w-32'>Request Type</div>
            <select
              id="requestType"
              name='requestType'
              className='text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded'
              onChange={handleReqTypeChange}
              value={requestType}
            >
            <option value={""} disabled>-- Select type --</option>
            {requestTypeList.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
            </select>
          </div>
          
          {requestType === "ROLE_CHANGE" && (
            <div className='flex items-center px-5 py-3 text-xs'>
              <RoleChangeForm setIsRequestModalOpen={setIsRequestModalOpen}/>
            </div>
          )}

          {requestType === "TEAM_REGISTRATION" && (
            <div className="px-4 py-3 flex items-center text-xs">
              <div className="w-32"><button onClick={handleSendTeamRegistrationRequestRequest} className="bg-blue-600 px-2 py-1.5 rounded-lg text-white hover:bg-blue-700 cursor-pointer">Send</button></div>
              <div className="w-64 text-center text-red-600">{errorMessage}</div>
            </div>
          )}

          {requestType === "TOURNAMENT_CREATION" && (
            <div className="px-4 py-3 flex items-center text-xs">
              <div className="w-32"><button onClick={handleSendTornamentOrganizationRequest} className="bg-blue-600 px-2 py-1.5 rounded-lg text-white hover:bg-blue-700 cursor-pointer">Send</button></div>
              <div className="w-64 text-center text-red-600">{errorMessage}</div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}

import React, { useContext, useState } from 'react'
import { RequestContext } from "../../../../context/RequestContext";
import CreateTeamForm from '../../team/form/CreateTeamForm';
import { IoClose } from "react-icons/io5";
import CreateTournamentForm from '../../tournaments/form/CreateTournamentForm';
import { updateRequest } from '../../../../service/requestService';
import { enrollTeam } from '../../../../service/tournamentService';
import { changeUserRole } from '../../../../service/usersService';

export const RequestDetailsModal = ({ selectedRequest, setSelectedRequest, setIsModalOpen, setRequests, decodedJwt }) => {
  const requContext = useContext(RequestContext);
  const [isProceedButtonClicked, setIsProceedButtonClicked] = useState(false);

/*   const handleRequestUpdate = (value) => {
    requContext.setTotalPendingRequests(prevCount => prevCount - 1);
    setIsModalOpen(false);
    const updatedSelectedRequest = {
      ...selectedRequest,
      status: value
    };
    updateRequest(updatedSelectedRequest, selectedRequest.id);

    setRequests((prevRequests) => 
      prevRequests.map((req) => 
        req.id === selectedRequest.id ? { ...req, status: value } : req
      )
    )
  }; */

  console.log("ovo je ode: ", selectedRequest);

  const [errorMessage, setErrorMessage] = useState(null);

  // prvo omogucit da se kreira request za enroll team
  const handleEnrollTeam = async  () => {
    const enrollTeamObject = {
      teamRepresentativeId: selectedRequest.requester.id,
      tournamentOrganizerId: decodedJwt.userId,
      requestId: selectedRequest.id
    }
    try {
      const response = await enrollTeam(enrollTeamObject);
      let value = response.data.data.status;
      
      setRequests((prevRequests) => 
        prevRequests.map((req) => 
          req.id === selectedRequest.id ? { ...req, status: value } : req
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleRoleChange = async ( statusValue ) => {
    const roleChangeObject = {
      requesterId: selectedRequest.requester.id,
      requestId: selectedRequest.id,
      status: statusValue,
      newRole: selectedRequest.desiredRole
    }
    try {
      const resposne = await changeUserRole(roleChangeObject);
      console.log("response: ", resposne);
      setRequests(resposne);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  // tek request mjenjam - kasnije se registrira tim
  const handleRegisterTeam = async ( statusValue ) => {
    const registerTeamObject = {
      requestId: selectedRequest.id,
      status: statusValue
    }
    try {
      const response = await updateRequest(registerTeamObject);
      setRequests((prevRequests) => 
        prevRequests.map((req) => 
          req.id === selectedRequest.id ? { ...req, status: statusValue } : req
        )
      )
      setIsModalOpen(false);
    } catch (error) {
      console.log("error -  ", error);
    }
  };

  const handleCreateTournament = async ( statusValue ) => {
    const createTournamentObject = {
      requestId: selectedRequest.id,
      status: statusValue
    }
    try { 
      const response = await updateRequest(createTournamentObject);
      setRequests((prevRequests) => 
        prevRequests.map((req) => 
          req.id === selectedRequest.id ? { ...req, status: statusValue } : req
        )
      )
      setIsModalOpen(false);
    } catch (error) {
      console.log("error -- ", error);
    }
  }

  console.log("jel ga ode minja - ", selectedRequest)

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center text-black">
      <div className="relative p-4 w-[400px] sm:w-[450px] md:w-[450px] lg:w-[500px] xl:w-[550px] 2xlw-[600px]">
        <div className="relative bg-white rounded-lg shadow-sm">

          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <div className="text-base md:text-lg 2xl:text-xl font-semibold text-gray-900 ">
              <span>Request Details</span>
            </div>

            <div>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  " data-modal-hide="default-modal">
                <IoClose className='w-5 h-5' />
              </button>
            </div>
          </div>

          <div className='text-center'>
            {errorMessage !== null && (
              <p className='text-red-400'>{errorMessage}</p>
            )}
          </div>

          {/* 1 slucaj -> kada requester pregledaje svoje requestove - 2 slucaj -> kada approver pregledaje requesterove requestove */}
          {selectedRequest.requester.id === decodedJwt.userId ? (
            <div>
              {selectedRequest.status === "PENDING" && (
                <div className='text-center bg-yellow-100 p-2 rounded-md'>Request is still pending...</div>
              )}
              {selectedRequest.status === "DECLINED" && (
                <div className='text-center bg-red-300 p-2 rounded-md'>Request was declined!</div>
              )}
              {selectedRequest.status === "APPROVED" && (
                <div className='text-center p-2 rounded-md text-black'>
                  {isProceedButtonClicked ? (
                    <>
                      {selectedRequest.requestType === 'TEAM_REGISTRATION' && (
                        <div>
                          <CreateTeamForm setIsModalOpen={setIsModalOpen} selectedRequest={selectedRequest} setRequests={setRequests} decodedJwt={decodedJwt} /> 
                        </div> 
                      )}
                      {selectedRequest.requestType === 'TOURNAMENT_CREATION' && (
                        <div>
                          <CreateTournamentForm setIsModalOpen={setIsModalOpen} selectedRequest={selectedRequest} decodedJwt={decodedJwt} />
                        </div>
                      )}
                      {selectedRequest.requestType === 'ROLE_CHANGE' && (
                        <div>
                          <span>Change role</span>
                        </div>
                      )}
                      {selectedRequest.requestType === 'TOURNAMENT_ENROLLMENT' && (
                        <div>
                          <span>Enroll tournament</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      {selectedRequest.requestFulfilled ? (
                        <>
                          <div className='p-2'>You already took action</div>                    
                        </>
                      ) : (
                        <>
                          <div className='p-2'>Request approved - take action</div>
                          <div><button onClick={() => setIsProceedButtonClicked(true)} className={`border border-black px-3 rounded-2xl`}>Proceed</button></div> {/* na proceed prominit UI modala ili ? */}
                        </>
                      )}

                    </div>
                  )}

                </div>
              )}
            </div>
          ) : (
            <div>
              {selectedRequest.status === "PENDING" && (
                <div className='text-white flex items-center justify-center space-x-5 p-5'>

                  {selectedRequest.requestType === "TOURNAMENT_ENROLLMENT" && (
                    <div className='flex items-center space-x-1'>
                      <div><button onClick={() => handleEnrollTeam("APPROVED")} className='bg-blue-500 px-2 py-1 rounded-xl'>Accept team enrollment</button></div>
                      <div><button onClick={() => handleEnrollTeam("DECLINED")} className='bg-red-500 px-2 py-1 rounded-xl'>Decline team enrollment</button></div>
                    </div>
                  )}

                  {selectedRequest.requestType === "TEAM_REGISTRATION" && (
                    <div className='flex items-center space-x-1'>
                      <div><button onClick={() => handleRegisterTeam("APPROVED")} className='bg-blue-500 px-2 py-1 rounded-xl'>Accept team registration</button></div>
                      <div><button onClick={() => handleRegisterTeam("DECLINED")} className='bg-red-500 px-2 py-1 rounded-xl'>Decline team registration</button></div>
                    </div>
                  )}

                  {selectedRequest.requestType === "ROLE_CHANGE" && (
                    <div className='flex items-center justify-between space-x-1'>
                      <div><button onClick={() => handleRoleChange("APPROVED")} className='bg-blue-500 px-2 py-1 rounded-xl'>Approve role change</button></div>
                      <div><button onClick={() => handleRoleChange("DECLINED")} className='bg-red-500 px-2 py-1 rounded-xl'>Decline role change</button></div>
                    </div>
                  )}

                  {selectedRequest.requestType === "TOURNAMENT_CREATION" && (
                    <div className='flex items-center justify-between space-x-1'>
                      <div><button onClick={() => handleCreateTournament("APPROVED")} className='bg-blue-500 px-2 py-1 rounded-xl'>Approve creating tournament</button></div>
                      <div><button onClick={() => handleCreateTournament("DECLINED")} className='bg-red-500 px-2 py-1 rounded-xl'>Decline creating tournament</button></div>
                    </div>
                  )}

                </div>
              )}
              {selectedRequest.status === "DECLINED" && (
                <div className='text-center bg-red-300 p-2 rounded-md'>You declined the request</div>
              )}
              {selectedRequest.status === "APPROVED" && (
                <div className='text-center bg-green-300 p-2 rounded-md'>You approved the request</div>
              )}
            </div>
          )
        }
        </div>
      </div>
    </div>
  )
}

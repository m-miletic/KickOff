import React, { useContext, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import CreateTeamForm from '../../team/form/CreateTeamForm';
import CreateTournamentForm from '../../tournaments/form/CreateTournamentForm';
import { updateRequest } from '../../../../service/requestService';
import { enrollTeam } from '../../../../service/tournamentService';
import { changeUserRole } from '../../../../service/usersService';
import { LoggedUserContext } from '../../../../context/LoggedUserContext';
import { RequestContext } from '../../../../context/RequestContext';
import { toast } from 'react-toastify';

export const RequestDetailsModal = ({ selectedRequest, setIsModalOpen, setRequests }) => {
  const requContext = useContext(RequestContext);
  const { decodedJwt } = useContext(LoggedUserContext);
  const [isProceedButtonClicked, setIsProceedButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEnrollTeam = async () => {
    const enrollTeamObject = {
      teamRepresentativeId: selectedRequest.requester.id,
      tournamentOrganizerId: decodedJwt.userId,
      requestId: selectedRequest.id,
    };
    try {
      const response = await enrollTeam(enrollTeamObject);
      const value = response.data.data.status;
      setRequests(prev => prev.map(req => req.id === selectedRequest.id ? { ...req, status: value } : req));
      setIsModalOpen(false);
    } catch (error) {
      console.log("Enroll team error:", error);
    }
  };

  const handleRoleChange = async (statusValue) => {
    const roleChangeObject = {
      requesterId: selectedRequest.requester.id,
      requestId: selectedRequest.id,
      status: statusValue,
      newRole: selectedRequest.desiredRole,
    };
    try {
      const response = await changeUserRole(roleChangeObject);
      setRequests(response);
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleRegisterTeam = async (statusValue) => {
    try {
      const response = await updateRequest({ requestId: selectedRequest.id, status: statusValue });
      setRequests(prev => prev.map(req => req.id === selectedRequest.id ? { ...req, status: statusValue } : req));
      setIsModalOpen(false);
    } catch (error) {
      console.log("Register team error:", error);
    }
  };


  const handleCreateTournament = async (statusValue) => {
    try {
      const response = await updateRequest({
        requestId: selectedRequest.id,
        status: statusValue,
      });
  
      setRequests(prev =>
        prev.map(req =>
          req.id === selectedRequest.id
            ? { ...req, status: statusValue }
            : req
        )
      );
  
      setIsModalOpen(false);

      if (statusValue === "APPROVED") {
        toast.success("Accepted user's request to host a tournament.", {
          autoClose: 2500,
        });
      } else if (statusValue === "DECLINED") {
        toast.error("Declined user's request to host a tournament.", {
          autoClose: 2500,
        });
      }
      
    } catch (error) {
      setIsModalOpen(false);
  
      toast.error(error?.data?.message || "Failed to update tournament request.", {
        autoClose: 3000,
        toastClassName: 'w-auto !min-w-0',
      });
  
      console.log("Create tournament error:", error);
    }
  };
  

  return (
    <>

      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="relative bg-white rounded-lg shadow-sm p-4 w-[90%] max-w-[550px]">
    
          <div className="flex items-center justify-between border-b pb-3 mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800">
              <IoClose className="w-5 h-5" />
            </button>
          </div>

    
          {errorMessage && (
            <div className="text-center text-red-500 mb-4">{errorMessage}</div>
          )}

    
          {selectedRequest.requester.id === decodedJwt.userId ? (
            <div>
              {selectedRequest.status === "PENDING" && (
                <div className="text-center bg-yellow-100 p-2 rounded">Request is still pending...</div>
              )}
              {selectedRequest.status === "DECLINED" && (
                <div className="text-center bg-red-300 p-2 rounded">Request was declined!</div>
              )}
              {selectedRequest.status === "APPROVED" && (
                <div className="text-center p-2 text-black">
                  {isProceedButtonClicked ? (
                    <>
                      {selectedRequest.requestType === 'TEAM_REGISTRATION' && (
                        <CreateTeamForm
                          setIsModalOpen={setIsModalOpen}
                          selectedRequest={selectedRequest}
                          setRequests={setRequests}
                          decodedJwt={decodedJwt}
                        />
                      )}
                      {selectedRequest.requestType === 'TOURNAMENT_CREATION' && (
                        <CreateTournamentForm
                          setIsModalOpen={setIsModalOpen}
                          selectedRequest={selectedRequest}
                          decodedJwt={decodedJwt}
                        />
                      )}
                      {selectedRequest.requestType === 'ROLE_CHANGE' && (
                        <div><span>Change role (TODO)</span></div>
                      )}
                      {selectedRequest.requestType === 'TOURNAMENT_ENROLLMENT' && (
                        <div><span>Enroll tournament (TODO)</span></div>
                      )}
                    </>
                  ) : (
                    <div>
                      {selectedRequest.requestFulfilled ? (
                        <div className="p-2">You already took action</div>
                      ) : (
                        <>
                          <div className="p-2">Request approved - take action</div>
                          <button onClick={() => setIsProceedButtonClicked(true)} className="border border-black px-3 py-1 rounded-xl">
                            Proceed
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mx-4 my-4 space-y-3 text-sm text-black">
                <div className="flex justify-between">
                  <span>Request Message:</span>
                  <span>{selectedRequest.message}</span>
                </div>
                <div className="flex justify-between">
                  <span>Requester:</span>
                  <span>{selectedRequest.requester.username}</span>
                </div>
              </div>


              {selectedRequest.status === "PENDING" && (
                <div className="text-white flex items-center justify-center space-x-4 p-4">
                  {selectedRequest.requestType === "TOURNAMENT_ENROLLMENT" && (
                    <>
                      <button onClick={() => handleEnrollTeam("APPROVED")} className="bg-blue-500 px-3 py-1 rounded-xl">Accept</button>
                      <button onClick={() => handleEnrollTeam("DECLINED")} className="bg-red-500 px-3 py-1 rounded-xl">Decline</button>
                    </>
                  )}
                  {selectedRequest.requestType === "TEAM_REGISTRATION" && (
                    <>
                      <button onClick={() => handleRegisterTeam("APPROVED")} className="bg-blue-500 px-3 py-1 rounded-xl">Accept</button>
                      <button onClick={() => handleRegisterTeam("DECLINED")} className="bg-red-500 px-3 py-1 rounded-xl">Decline</button>
                    </>
                  )}
                  {selectedRequest.requestType === "ROLE_CHANGE" && (
                    <>
                      <button onClick={() => handleRoleChange("APPROVED")} className="bg-blue-500 px-3 py-1 rounded-xl">Approve</button>
                      <button onClick={() => handleRoleChange("DECLINED")} className="bg-red-500 px-3 py-1 rounded-xl">Decline</button>
                    </>
                  )}
                  {selectedRequest.requestType === "TOURNAMENT_CREATION" && (
                    <>
                      <button onClick={() => handleCreateTournament("APPROVED")} className="bg-blue-500 px-3 py-1 rounded-xl">Approve</button>
                      <button onClick={() => handleCreateTournament("DECLINED")} className="bg-red-500 px-3 py-1 rounded-xl">Decline</button>
                    </>
                  )}
                </div>
              )}

              {selectedRequest.status === "DECLINED" && (
                <div className="text-center bg-red-300 p-2 rounded-md">You declined the request</div>
              )}
              {selectedRequest.status === "APPROVED" && (
                <div className="text-center bg-green-300 p-2 rounded-md">You approved the request</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

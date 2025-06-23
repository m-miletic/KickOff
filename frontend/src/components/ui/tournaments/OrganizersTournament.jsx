import React, { useContext, useEffect, useState } from "react";
import { enrollTeam, fetchOrganizersTournament, removeTeamFromTournament, updateTournament } from "../../../service/tournamentService";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { fetchRequestsByApprover } from "../../../service/requestService";
import { toast } from "react-toastify";
import { IoEye } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

const OrganizersTournament = () => {
  const [error, setError] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [showAllMatches, setShowAllMatches] = useState(false);

  const { decodedJwt } = useContext(LoggedUserContext);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [totalPendingRequests, setTotalPendingRequests] = useState("");
  const [visibleRequests, setVisibleRequests] = useState(4);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

/*   const [recentlyHandledRequest, setRecentlyHandledRequest] = useState(null); */

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const [tournament, setTournament] = useState({})

  const [editTournamentForm, setEditTournamentForm] = useState({});
  const matches = tournament?.matchesList || [];
  const displayMatches = showAllMatches ? matches : matches.slice(0, 3);

  console.log("Pending Requests: ", pendingRequests)

  useEffect(() => {
    if(tournament) {
      setEditTournamentForm(tournament)
    }
  }, [tournament])

  useEffect(() => {
    const getTournament = async () => {
      try {
        const response = await fetchOrganizersTournament(decodedJwt.userId)
        setTournament(response.data)
      } catch (error) {
        console.error("Error while fetching organizers tournament: ", error)
      }
    }

    getTournament()
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1000);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // iako nemoze se ovo ba sni dogodit al ok
  useEffect(() => {
    if (enrollError) {
      const timer = setTimeout(() => {
        setEnrollError("");
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [enrollError]);

  // Fetch pending requests
  useEffect(() => {
    if(!decodedJwt) return;
    const fetchPendingRequests = async () => {
      const requestObject = {
        status: 'PENDING',
        timeCreated: 'All',
        sortDirection: 'ASC',
        pageSize: 10
      };
      try {
        const response = await fetchRequestsByApprover(decodedJwt.userId, requestObject);
        setPendingRequests(response.data.requests);
        setTotalPendingRequests(response.data.totalRequests);
      } catch (error) {
        console.error("Error while fetching recieved requests: ", error);
      }
    };

    fetchPendingRequests();
  }, [decodedJwt?.userId]);

  // Handle approve/decline
  const handleEnrollTeam = async (request, statusValue) => {
    const payload = {
      teamRepresentativeId: request.requester.id,
      tournamentOrganizerId: decodedJwt.userId,
      requestId: request.id,
      status: statusValue,
    };

    try {
      const response = await enrollTeam(payload);
      if (response.success === true) {
        setPendingRequests((prevPenRequests) => 
          prevPenRequests.filter((req) => req.id !== request.id)
        )
        setTournament((prevTournament) => ({
          ...prevTournament,
          teams: [...(prevTournament.teams || []), response.data]
        }))
        setTotalPendingRequests(totalPendingRequests-1)
        if (statusValue === "APPROVED") {
          toast.success("Approved request to join tournament", {
            autoClose: 2500
          })

        } else if (statusValue === "DECLINED") {
          toast.error("Declined request to join tournament", {
            autoClose: 2500
          })
        }
      }
/*       setPendingRequests(response.data.data.requests);
      setTotalPendingRequests(response.data.data.totalRequests); */
    } catch (error) {
      setEnrollError(error);
    }
  };

  const handleClickPreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
    setIsEditOpen(false);
  };

  const handleClickEdit = () => {
    setIsEditOpen(!isEditOpen);
    setIsPreviewOpen(false);
  };

  const handleInputChange = (e) => {
    setEditTournamentForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateTournament = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTournament(tournament.id, editTournamentForm);
  
      if (response.data.success === true) {
        setTournament(response.data.data);
        toast.success("Tournament Updated!", {
          autoClose: 2500
        });
        setError("");
      } else {
        // Backend responded with 200 but success=false (shouldn't happen if using proper HTTP codes)
        toast.error(response.data.message || "Update failed", {
          autoClose: 3000
        });
      }
  
    } catch (error) {
      console.log("Update error: ", error);
  
      // Handle structured backend error (from our enhanced API function)
      if (error.status && error.message) {
        setError(error.message); // show somewhere in UI
        toast.error(`Error: ${error.message}`, {
          autoClose: 3000
        });
      } else {
        // Handle unknown or unexpected error
        setError("Unexpected error occurred.");
        toast.error("Unexpected error occurred.", {
          autoClose: 3000
        });
      }
    }
  };

  const handleKickTeam = async (teamId) => {
    try {
      const response = await removeTeamFromTournament(teamId)
      const kickedTeam = response.data;
      setTournament((prevTournament) => ({
        ...prevTournament,
        teams: prevTournament.teams.filter((team) => team.id !== kickedTeam.id)
      }))
      if (response.data.success === true) {
        toast.success("Team Kicked From Tournament", {
          autoClose: 2500
        })
      }
    } catch (error) {
      console.log("Team Kick Error: ", error);
    }
  };



  console.log("Is preview open: ", isPreviewOpen)
  console.log("tournament: ", tournament)
  

  return (
    <div className="text-white py-6 flex justify-center items-start mt-12 space-x-6 ">
      {isMobileView ? (
        <>
        <button
          onClick={() => setShowRequestsModal(true)}
          className="
            fixed top-4 left-1/2 -translate-x-1/2 z-50
            sm:static sm:translate-x-0 sm:left-auto mt-16 text-[10px] sm:text-[13px] lg:text-[15px]
            ml-8 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold 
          "
          >
          View Pending Requests
        </button>



          {showRequestsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-start backdrop-blur-sm bg-white/10 ">

              <div className="bg-[#001E28] text-white rounded-lg p-6 w-[90%] relative">
                <button
                  onClick={() => setShowRequestsModal(false)}
                  className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-500"
                >
                  &times;
                </button>

                <div className="text-xs font-semibold mb-4">Pending Requests</div>

{/*                 {enrollError ? (
                  <div className="text-center pb-2">
                    <span className="text-red-400 text-sm italic">{enrollError}</span>
                  </div>
                ) : recentlyHandledRequest ? (
                  <div
                    className={`mb-2 italic text-sm text-center ${
                      recentlyHandledRequest.status === "APPROVED"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    Request from <strong>{recentlyHandledRequest.username}</strong> has been{" "}
                    {recentlyHandledRequest.status.toLowerCase()}.
                  </div>
                ) : null} */}

                {pendingRequests.length > 0 ? (
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto mt-2">
                    {pendingRequests.slice(0, visibleRequests).map((req) => (
                      <div
                        key={req.id}
                        className="bg-[#00303f] p-3 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <div>
                            <span>Request From: </span>
                            <span className="text-sm">{req.requester.username}</span>
                          </div>
                          <div className="text-sm text-gray-300">{req.message}</div>
                        </div>
                        <div className="space-x-2 flex items-center justify-center">
                          <button
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                            onClick={() => handleEnrollTeam(req, "APPROVED")}
                          >
                            Accept
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                            onClick={() => handleEnrollTeam(req, "DECLINED")}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-2">
                      <span className="text-gray-400 text-base">
                        Total pending: {totalPendingRequests}
                      </span>
                    </div>
                    {pendingRequests.length > 4 && (
                      <div className="text-center mt-2">
                        <button
                          onClick={() =>
                            setVisibleRequests((prev) => (prev === 4 ? 8 : 4))
                          }
                          className="text-blue-400 hover:underline text-sm"
                        >
                          {visibleRequests === 4 ? "Show More" : "Show Less"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-300">No pending requests yet.</div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <aside className="bg-[#001E28] rounded-lg p-4 min-h-[400px] h-auto w-[30vw] ml-8">
          <div className="text-lg font-semibold mb-4">Pending Requests</div>

{/*           {enrollError ? (
            <div className="text-center pb-2">
              <span className="text-red-400 text-sm italic">{enrollError}</span>
            </div>
          ) : recentlyHandledRequest ? (
            <div
              className={`mb-2 italic text-sm text-center ${
                recentlyHandledRequest.status === "APPROVED"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              Request from <strong>{recentlyHandledRequest.username}</strong> has been{" "}
              {recentlyHandledRequest.status.toLowerCase()}.
            </div>
          ) : null} */}


          {/* ✅ Requests List */}
          {fetchOrganizersTournament.length > 0 ? (
            <div className="space-y-2">
              {pendingRequests.slice(0, visibleRequests).map((req) => (
                <div
                  key={req.id}
                  className="bg-[#00303f] p-3 rounded-md flex justify-between items-center"
                >
                  <div>
                    <div>
                      <span>Request From: </span>
                      <span className="text-sm">{req.requester.username}</span>
                    </div>
                    <div className="text-sm text-gray-300">{req.message}</div>
                  </div>
                  <div className="space-x-2 flex items-center justify-center">
                    <button
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                      onClick={() => handleEnrollTeam(req, "APPROVED")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                      onClick={() => handleEnrollTeam(req, "DECLINED")}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-center">
                <span className="text-gray-400 text-base">
                  Total requests pending: {totalPendingRequests}
                </span>
              </div>

              {pendingRequests.length > 4 && (
                <div className="text-center mt-2">
                  <button
                    onClick={() =>
                      setVisibleRequests((prev) => (prev === 4 ? 8 : 4))
                    }
                    className="text-blue-400 hover:underline text-sm"
                  >
                    {visibleRequests === 4 ? "Show More" : "Show Less"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-300">No pending requests yet.</div>
          )}
        </aside>
      )}



      {/* Tournament Preview + Edit */}
      <div className="flex flex-1 flex-col space-y-4 ml-6 pl-12 pr-16 text-[10px] sm:text-[13px] lg:text-[15px]">
        <div className="bg-[#001E28] min-h-16 rounded-lg flex items-center justify-between px-10 py-4">
          <div className="text-xs sm:text-[13px] lg:text-[15px] font-medium">{tournament?.tournamentName}</div>
          <div className="flex space-x-4">
            <button onClick={handleClickPreview} className="bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200 px-3 py-1 rounded flex justify-center items-center">
              <span className="mr-1"><IoEye /></span>Preview
            </button>
            <button onClick={handleClickEdit}  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 px-3 py-1 rounded flex justify-center items-center">
              <span className="mr-1"><FaEdit /></span>Edit
            </button>
          </div>
        </div>

        {/* Preview Mode */}
        {isPreviewOpen && (
          <div className="flex flex-col space-y-4 text-[10px] sm:text-[13px] lg:text-[15px]">
            {/* Tournament Details */}
            <div className="bg-[#001E28] rounded-lg py-4">
              <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Tournament Details</div>
              <div className="mt-4 px-10">
                <div className="py-[2px]">
                  {tournament?.details || "No details provided."}
                </div>
              </div>
            </div>

            {/* Matches */}
            <div className="bg-[#001E28] rounded-lg py-4">
              <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Matches</div>
              <div className="mt-4 px-10">
              {displayMatches.length > 0 ? (
                displayMatches.map((match, index) => (
                  <div key={index} className="py-[2px] flex justify-start items-center">
                    <span className="mr-2 text-[10px] sm:text-[13px] lg:text-[15px]">•</span> {/* bullet */}
                    <div className="text-[10px] sm:text-[13px] lg:text-[15px]">
                      {match.homeTeam.teamName} <span className="text-[10px] sm:text-[13px] lg:text-[15px]">VS</span> {match.awayTeam.teamName}
                    </div>
                  </div>
                ))
                ) : (
                  <div>No matches scheduled yet.</div>
                )}
                {matches.length > 3 && (
                  <button
                    className="mt-3 text-blue-600 underline"
                    onClick={() => setShowAllMatches(!showAllMatches)}
                  >
                    {showAllMatches ? "Show Less" : "Show All ..."}
                  </button>
                )}
              </div>
            </div>

            {/* Teams */}
            <div className="bg-[#001E28] rounded-lg py-4">
              <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Teams</div>
              <div className="mt-4 px-10">
                {tournament?.teams?.length > 0 ? (
                  tournament.teams.map((team, index) => (
                    <div key={index} className="py-[2px]">{team.teamName}</div>
                  ))
                ) : (
                  <div>No teams added yet.</div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-[#001E28] rounded-lg py-4">
              <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Date</div>
              <div className="mt-4 px-10 space-y-2">
                <div className="flex">
                  <div className="w-24 font-medium">Start Date:</div>
                  <div>{tournament.startDate}</div>
                </div>
                <div className="flex">
                  <div className="w-24 font-medium">End Date:</div>
                  <div>{tournament.endDate}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditOpen && (
          <div className="bg-[#001E28] rounded-lg p-4  mx-auto shadow-lg lg:w-[600px] xl:w-[750px] 2xl:w-[870px] sm:p-6">
            <form onSubmit={handleUpdateTournament} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block mb-1 font-semibold text-lg sm:text-lg">
                  Tournament Name:
                </label>
                <input
                  type="text"
                  name="tournamentName"
                  value={editTournamentForm.tournamentName || ""}
                  onChange={handleInputChange}
                  className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-lg sm:text-lg">
                  Details:
                </label>
                <input
                  type="text"
                  name="details"
                  value={editTournamentForm.details || ""}
                  onChange={handleInputChange}
                  className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
                />
              </div>

              <label className="block mb-1 font-semibold text-[0.75rem] sm:text-lg">
                  Enrolled Teams:
                </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournament?.teams?.length > 0 ? (
                  tournament?.teams?.map((team) => (
                    <div
                      key={team.id}
                      className="bg-[#00303f] rounded-lg flex flex-col justify-between items-center shadow-md h-[65px] w-[275px]" // fix height
                    >
                      {showDeleteConfirmation === team.id ? (
                        <div className="flex justify-between items-center w-full h-full px-4">
                          <div className="text-white text-sm">Are you sure?</div>
                          <div className="flex justify-end space-x-2 ml-4">
                            <div>
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => handleKickTeam(team.id)}
                              >
                                Yes
                              </button>
                            </div>

                            <div>
                              <button
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                                onClick={() => setShowDeleteConfirmation(null)}
                              >
                                Cancel
                              </button>
                            </div>

                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full h-full px-4">
                          <div className="text-white">{team.teamName}</div>
                          <div>
                            <button
                              onClick={() => setShowDeleteConfirmation(team.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Kick
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-white">No teams enrolled yet</div>
                )}
                
              </div>

              

              <div className="flex space-x-3 sm:space-x-6">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-[0.75rem] sm:text-lg">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={editTournamentForm.startDate || ""}
                    onChange={handleInputChange}
                    className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
                  />
                </div>

                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-[0.75rem] sm:text-lg">
                    End Date:
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={editTournamentForm.endDate || ""}
                    onChange={handleInputChange}
                    className="w-full text-black p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-3 text-xs sm:text-base"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-center text-sm sm:text-base">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md py-2 text-sm font-semibold text-white sm:py-3 sm:text-base"
              >
                Save
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrganizersTournament;

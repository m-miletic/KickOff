import React, { useContext, useEffect, useState } from "react";
import { fetchOrganizersTournament } from "../../../service/tournamentService";
import { IoEye } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import EditTournamentForm from "./form/EditTournamentForm";
import PreviewTournamentByOwner from "./PreviewTournamentByOwner";
import OrganizersPendingRequests from "../request/OrganizersPendingRequests";
import { LoggedUserContext } from "../../../context/LoggedUserContext";

const OrganizersTournament = () => {

  const [enrollError, setEnrollError] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [tournament, setTournament] = useState()
  const { decodedJwt } = useContext(LoggedUserContext);

/*   const [recentlyHandledRequest, setRecentlyHandledRequest] = useState(null); */

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
  const [showRequestsModal, setShowRequestsModal] = useState(false);



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




  useEffect(() => {
    if (enrollError) {
      const timer = setTimeout(() => {
        setEnrollError("");
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [enrollError]);

  // Fetch pending requests

  const handleClickPreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
    setIsEditOpen(false);
  };

  const handleClickEdit = () => {
    setIsEditOpen(!isEditOpen);
    setIsPreviewOpen(false);
  };


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
        <OrganizersPendingRequests setTournament={setTournament} />
      )}
      <div className="flex flex-1 flex-col space-y-4 ml-6 pl-12 pr-16 text-[10px] sm:text-[13px] lg:text-[15px]">
        <div className="bg-[#001E28] min-h-16 rounded-lg flex items-center justify-between px-10 py-4">
          <div className="text-xs sm:text-[13px] lg:text-[15px] font-medium">{tournament ? tournament.tournamentName : "Doesn't host any tournaments yet"}</div>
          {tournament && (
            <div className="flex space-x-4">
              <button onClick={handleClickPreview} className="bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200 px-3 py-1 rounded flex justify-center items-center">
                <span className="mr-1"><IoEye /></span>Preview
              </button>
              <button onClick={handleClickEdit}  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 px-3 py-1 rounded flex justify-center items-center">
                <span className="mr-1"><FaEdit /></span>Edit
              </button>
            </div>
          )}
        </div>

        {isPreviewOpen && (
          <PreviewTournamentByOwner tournament={tournament} />
        )}

        {isEditOpen && (
          <EditTournamentForm tournament={tournament} setTournament={setTournament} />
        )}
      </div>
    </div>
  );
};
export default OrganizersTournament;

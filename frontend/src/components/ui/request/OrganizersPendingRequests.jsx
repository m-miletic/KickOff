import React, { useContext, useEffect, useState } from "react";
import { fetchRequestsByApprover } from "../../../service/requestService";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { enrollTeam } from "../../../service/tournamentService";
import { toast } from "react-toastify";

const OrganizersPendingRequests = ({ setTournament }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const { decodedJwt } = useContext(LoggedUserContext);
  const [totalPendingRequests, setTotalPendingRequests] = useState("");
  const [visibleRequests, setVisibleRequests] = useState(4);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [requestAnswer, setRequestAnswer] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)


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
          teams: [...(prevTournament.teams || []), response.data] // u slucaju da tournament jos nema timova tj. da su null/undefined osigurat se s []
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

  const handleShowConfirmDialog = (value, req) => {
    setSelectedRequest(req)
    setShowConfirmDialog(true)
    setRequestAnswer(value)
  }


  return(
    <aside className="bg-[#001E28] rounded-lg p-4 min-h-[400px] h-auto w-[30vw] ml-8">
      <div className="text-lg font-semibold mb-4">Pending Requests</div>

      {pendingRequests.length > 0 ? (
        <div className="space-y-2">
          {pendingRequests.slice(0, visibleRequests).map((req) => (
            showConfirmDialog && (req.id === selectedRequest.id)  ? (
              <div className="flex justify-between items-center p-3 rounded-md bg-[#00303f] ">
                <div>Are You Sure?</div>
                <div className="space-x-2 flex">
                  <div><button onClick={() => handleEnrollTeam(req, requestAnswer)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">Yes</button></div>
                  <div><button onClick={() => setShowConfirmDialog(false)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Cancel</button></div>
                </div>
              </div>
            ) : (
              <div key={req.id} className="bg-[#00303f] p-3 rounded-md flex justify-between items-center">
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
                    onClick={() => handleShowConfirmDialog("APPROVED", req)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                    onClick={() => handleShowConfirmDialog("DECLINED", req)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )

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
);
}
export default OrganizersPendingRequests;
import React, { useContext, useEffect, useState } from "react";
import { fetchRequestsByApprover, updateRequest } from "../../../service/requestService";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { toast } from "react-toastify";
import Pagination from "../../common/navigation/Pagination";

const AdminsPendingRequests = () => {

  const [pendingRequests, setPendingRequests] = useState([])
  const { decodedJwt } = useContext(LoggedUserContext)
  const [paginationFilters, setPaginationFilters] = useState({
    status: "PENDING",
    pageNumber: 1
  });
  const [totalPages, setTotalPages] = useState()

  useEffect(() => {
    if (!decodedJwt) return;

    const fetchRequests = async () => {
      try {
        const response = await fetchRequestsByApprover(decodedJwt?.userId, paginationFilters)
        setTotalPages(response.data.totalPages)
        setPendingRequests(response.data.requests)
      } catch (error) {
        console.log("Error: ", error)
      } 
    }

    fetchRequests()
  }, [decodedJwt, paginationFilters])
  

  const handleRegisterTeam = async (statusValue, reqId) => {
    const updateReqObj = {
      status: statusValue,
      requestId: reqId
    }
    try {
      const response = await updateRequest(updateReqObj);
      const updatedRequest = response.data;
      setPendingRequests((prevRequests) => prevRequests.filter(req => req.id !== updatedRequest.id));
      if (updatedRequest.status === "APPROVED") {
        toast.success("Request Approved!", {
          autoClose: 1500
        })
      } else if (updatedRequest.status === "DECLINED") {
        toast.success("Request Declined!", {
          autoClose: 1500
        })
      }
    } catch (error) {
      console.log("Register team error:", error);
    }
  };

  const handleSetSelectedFilter = (filterType, value) => {
    setPaginationFilters((prevValues) => ({
      ...prevValues,
      [filterType]: value,
    }));
  };



  return(
    <div className="fixed top-2 bottom-2 right-2 w-96 rounded-xl bg-[#1F2937] px-4 text-white">
      <div className="text-2xl p-4 border-b border-gray-300">Requests</div>
      <div className="py-6">
        {pendingRequests?.length > 0 ? (
          pendingRequests.map((request) => (
            <div className="hover:bg-[#374151] py-4 px-2 rounded-xl cursor-pointer">
              <div><span className="font-semibold">{request.requester.username}</span> <span className="text-gray-300">sent a request with message</span></div>
              <div>{request.message}</div>
              <div className="flex justify-start items-center space-x-2 py-2">
                <div onClick={() => handleRegisterTeam("APPROVED", request.id)} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg">Accept</div>
                <div onClick={() => handleRegisterTeam("DECLINED", request.id)}  className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-lg">Decline</div>
              </div>
              <div></div>
            </div>
          ))
        ) : (
          <div className="">No Pending Requests</div>
        )}

        <div className='text-center bottom-1'>
          <Pagination totalPages={totalPages} selectedFilters={paginationFilters} handleSelectFilter={handleSetSelectedFilter} navButtonStyle={'text-white w-5 h-5 px-4 '} />
       </div>
      </div>
    </div>
  );

}
export default AdminsPendingRequests;
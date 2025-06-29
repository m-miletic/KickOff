import React, { useState, useContext, useEffect } from 'react'
import { REQUEST_TIME_CREATED, REQUEST_STATUS } from '../../../data/requestFilters';
import { DropdownButton } from '../../common/dropdown/DropdownButton';
import { useFetchRequests } from '../../../hooks/requestHook';
import { RequestDetailsModal } from './modal/RequestDetailsModal';
import Pagination from '../../common/navigation/Pagination';
import { ActiveComponentContext } from '../../../context/ActiveComponentContext';
import DropdownContent from '../../common/dropdown/DropdownContent';
import { LoggedUserContext } from '../../../context/LoggedUserContext';

const RequestList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);

  const { activeComponent } = useContext(ActiveComponentContext);
  const { decodedJwt } = useContext(LoggedUserContext)

  const [selectedFilters, setSelectedFilters] = useState({
    status: 'ALL',
    timeCreated: 'Last 7 days',
    sortDirection: 'DESC',
    pageNumber: 1,
    pageSize: 5
  });

  const [isStatusDropdownOpen, setIsStatusOpen] = useState(false);
  const [isTimeCreatedDropdownOpen, setIsTimeCreatedDropdownOpen] = useState(false);

  const toggleStatusDropdown = () => {
    setIsStatusOpen(!isStatusDropdownOpen);
  };

  const toggleTimeCreatedDropdown = () => {
    setIsTimeCreatedDropdownOpen(!isTimeCreatedDropdownOpen);
  };

  const handleSetSelectedFilter = (filterType, value) => {
    setSelectedFilters((prevValues) => ({
      ...prevValues,
      [filterType]: value,
    }));
    filterType === 'status' ? setIsStatusOpen(false) : filterType === 'timeCreated' && setIsTimeCreatedDropdownOpen(false)
  };

  const showRequestModal = (selectedReq) => {
    setSelectedRequest(selectedReq);
    setIsModalOpen(true);
  };

  const { requests, setRequests, totalPages, error } = useFetchRequests(decodedJwt?.userId, selectedFilters, activeComponent);


  return (
    <div className={`text-black text-[12px] sm:text-xs xl:text-base`}>

      <div className='flex justify-between pb-4 space-x-1'>

        <div>
          <DropdownButton
            title={selectedFilters.status}
            isDropdownOpen={isStatusDropdownOpen}
            toggleDropdown={toggleStatusDropdown}
          />

          {isStatusDropdownOpen && (
            <DropdownContent
              values={REQUEST_STATUS}
              filterType={'status'}
              onSelect={handleSetSelectedFilter}
            />
          )}
        </div>

        <div>
          <DropdownButton
            title={selectedFilters.timeCreated}
            isDropdownOpen={isTimeCreatedDropdownOpen}
            toggleDropdown={toggleTimeCreatedDropdown}
          />

          {isTimeCreatedDropdownOpen && (
            <DropdownContent
              values={REQUEST_TIME_CREATED}
              filterType={'timeCreated'}
              onSelect={handleSetSelectedFilter}
            />
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-600 ">
        <table className="w-full">
          <thead className="bg-[#001E28] rounded-t-lg text-white text-[10px] sm:text-xs lg:text-base">
            <tr className="rounded-t-lg">
              {(decodedJwt?.role === 'ADMIN') && (
                <th className="px-4 py-3 text-leftrounded-tl-lg">Requested by</th>
              )}
              <th className="px-4 py-3 text-left" data-type="date" data-format="YYYY/DD/MM">
                <span className="flex items-center">
                  Time of request
                  <svg
                    onClick={() => handleSetSelectedFilter('sortDirection', selectedFilters.sortDirection === 'ASC' ? 'DESC' : 'ASC')}
                    className="cursor-pointer w-4 h-4 ms-1 "
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m8 15 4 4 4-4m0-6-4-4-4 4"
                    />
                  </svg>
                </span>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3 rounded-tr-lg"></th>
            </tr>
          </thead>
          <tbody className='text-[9px] sm:text-[11px] lg:text-[12px] xl:text-[14px]'>
            {requests?.map((request, index) => (
              <tr
                key={request.id}
                className={`
                  ${selectedFilters.status === 'PENDING' && request.status !== 'PENDING' ? 'hidden' : ''} 
                  border-b border-gray-700 
                  ${index % 2 === 0 ? 'bg-[#00303f]' : 'bg-[#001E28]'}
                `}
              >
                {(decodedJwt?.role === 'ADMIN') && (
                  <td className="px-2 sm:px-4 lg:px-6 xl:px-8 py-4 text-white">{request.requester.username}</td>
                )}
                <td className="px-2 sm:px-4 lg:px-6 xl:px-8 py-4 text-white">{request.timeCreated.split('T')[0]} {request.timeCreated.split('T')[1].slice(0, 5)}</td>
                <td className="px-2 sm:px-4 lg:px-6 xl:px-8 py-4 text-white">{request.status}</td>
                <td>
                  <span
                    className={`w-3 h-3 rounded-full inline-block mr-2 ${
                      request.status === 'PENDING'
                        ? 'bg-yellow-400'
                        : request.status === 'DECLINED'
                        ? 'bg-red-600'
                        : 'bg-green-600'
                    }`}
                  ></span>
                </td>
                <td className="py-4 pr-1">
                  <button onClick={() => showRequestModal(request)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-[10px] px-3 py-1">
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {isModalOpen && (
        <RequestDetailsModal selectedRequest={selectedRequest} setIsModalOpen={setIsModalOpen} setRequests={setRequests} />
      )}

    </div>

      <div className='text-center mt-4'>
        <Pagination totalPages={totalPages} selectedFilters={selectedFilters} handleSelectFilter={handleSetSelectedFilter} navButtonStyle="text-black w-5 h-5 px-4" totalPagesStyle="text-black" />
      </div>
    </div>
  )
}

export default RequestList;

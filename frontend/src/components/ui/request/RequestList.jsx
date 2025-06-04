import React, { useState, useContext } from 'react'
import { REQUEST_TIME_CREATED, REQUEST_STATUS } from '../../../data/requestFilters';
import { DropdownButton } from '../../common/dropdown/DropdownButton';
import { useFetchRequests } from '../../../hooks/requestHook';
import { RequestDetailsModal } from './modal/RequestDetailsModal';
import Pagination from '../../common/navigation/Pagination';
import { ActiveComponentContext } from '../../../context/ActiveComponentContext';
import DropdownContent from '../../common/dropdown/DropdownContent';

const RequestList = ({ decodedJwt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState([]);
/*   const { totalPages } = useContext(RequestContext); */

  const { activeComponent } = useContext(ActiveComponentContext);

  const [selectedFilters, setSelectedFilters] = useState({
    userId: decodedJwt.userId,
    status: 'PENDING',
    timeCreated: 'Last 7 days',
    sortDirection: 'DESC',
    pageNumber: 1,
    pageSize: 2
  });

  const [isStatusDropdownOpen, setIsStatusOpen] = useState(false);
  const [isTimeCreatedDropdownOpen, setIsTimeCreatedDropdownOpen] = useState(false);

  const toggleStatusDropdown = () => {
    setIsStatusOpen(!isStatusDropdownOpen);
  };

  const toggleTimeCreatedDropdown = () => {
    setIsTimeCreatedDropdownOpen(!isTimeCreatedDropdownOpen);
  };

  const handleSetSelectedFilter = ( filterType, value ) => {
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

  const { requests, setRequests, totalPages, error } = useFetchRequests(selectedFilters, activeComponent);

  return (
    <div className={`text-white text-[12px] sm:text-xs xl:text-base`}>

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

      <table id="default-table" className={`${isModalOpen && 'opacity-20'}`}>
        <thead>
          <tr>
            {decodedJwt.role === 'ADMIN' && (
              <th>
                <span className="px-2">
                  Requested by
                </span>
              </th>
            )}

            <th data-type="date" data-format="YYYY/DD/MM">
              <span className="flex items-center px-2">
                Time of request
                <svg onClick={() => handleSetSelectedFilter('sortDirection', selectedFilters.sortDirection === 'ASC' ? 'DESC' : 'ASC')} className="cursor-pointer w-4 h-4 ms-1 2xl:w-5 2xl:h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/>
                </svg>
              </span>
            </th>
            <th>
              <span className="flex items-center px-2">
                Status
              </span>
            </th>
          </tr>
        </thead>
          <tbody>
            {requests.map((request) => {
              selectedFilters.status === 'PENDING' && request.status === 'PENDING' && {}
              return(
                <tr key={request.id} className={`${selectedFilters.status === 'PENDING' && request.status !== 'PENDING' ? 'hidden' : ''} `}>{/* kako bi dobio dojam real-time update-a kada admin respond-a na request */}
                  {decodedJwt.role === "ADMIN" || decodedJwt.role === 'TOURNAMENT_ORGANIZER'  && (
                    <td>{request.requester.email}</td>
                  )}
                  <td className='px-2'>{request.timeCreated}</td>
                  <td className='px-2'>{request.status}</td>
                  <td><span className={`w-2 h-2 2xl:w-[10px] 2xl:h-[10px] rounded-xl inline-block mr-2
                    ${request.status === 'PENDING'
                      ? 'bg-yellow-200'
                      : request.status === 'DECLINED'
                      ? 'bg-red-400'
                      : 'bg-green-400'
                    }`}></span>
                  </td>
                  <td>
                    <button onClick={() => showRequestModal(request)} className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-2xs px-1 py-[3px] my-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none 2xl:px-2 2xl:py-1'>
                      Open
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
      </table>

      <div className='text-center mt-2'>
        <Pagination totalPages={totalPages} selectedFilters={selectedFilters} handleSelectFilter={handleSetSelectedFilter} />
      </div>

      {isModalOpen && (
        <div>
          <RequestDetailsModal selectedRequest={selectedRequest} setSelectedRequest={setSelectedRequest} setIsModalOpen={setIsModalOpen} setRequests={setRequests} decodedJwt={decodedJwt} />
        </div>
      )}

    </div>
  )
}
export default RequestList

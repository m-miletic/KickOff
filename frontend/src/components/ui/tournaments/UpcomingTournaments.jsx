import React, { useContext, useState } from 'react'
import { useFetchUpcomingTournaments } from '../../../hooks/tournaments/useFetchTournaments';
import { ActiveModalContext } from '../../../context/ActiveModalContext';
import { FaRegEye } from "react-icons/fa";
import PreviewTournamentCard from './card/PreviewTournamentCard';
import { LoggedUserContext } from '../../../context/LoggedUserContext';
import Pagination from '../../common/navigation/Pagination';
import DeleteTournamentModal from './modal/DeleteTournamentModal';
import { RiDeleteBin6Line } from "react-icons/ri";

const UpcomingTournaments = () => {

  const { decodedJwt } = useContext(LoggedUserContext)
  const [selectedTournament, setSelectedTournament] = useState();
  const [filters, setFilters] = useState({
    pageNumber: 1,
  });

  const { tournaments = [], setTournaments, error, loading } = useFetchUpcomingTournaments(filters.pageNumber);
/*   const { isPreviewModalOpen, setIsPreviewModalOpen, isDeleteModalOpen, setIsDeleteModalOpen } = useContext(ActiveModalContext); */

/*   const handlePreviewButtonClick = (tournament) => {
    console.log("Tournament in time of clicking preview: ", tournament)
    setSelectedTournament(tournament);
    setFilters((prev) => ({
      ...prev,
      tournamentId: tournament.id
    }));
    setIsPreviewModalOpen(true);
  };

  const handleDeleteButtonClick = (tournament) => {
    setSelectedTournament(tournament);
    setIsDeleteModalOpen(true);
  }; */

  const handleSelectFilter = (type, value) => {
    setFilters((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
  };

  console.log("tournaments: ", tournaments)

  return (  
    <div className="w-[60%] mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tournaments?.tournamentsList?.length > 0 ? (
              tournaments.tournamentsList.map((tournament) => (
                <PreviewTournamentCard key={tournament.id} tournament={tournament} />
              ))
            ) : (
              <div>Nema nista</div>
            )}
          </div>

        <div className='text-center mt-5'>
          <Pagination totalPages={tournaments.totalPages} selectedFilters={filters} handleSelectFilter={handleSelectFilter} />
        </div>
      </div>


/*     <div className='w-[325px] sm:w-[400px] lg:w-[500px] xl:w-[600px] text-xs sm:text-sm 2xl:text-base text-gray-900 mt-20 space-y-1'>

      <div className='bg-[#001E28] p-3 rounded-md flex justify-between items-center font-semibold text-white'>
        <div>Tournament</div>
        <div>Preview</div>
      </div>

      <div className='p-2'>
        {tournaments.tournamentsList.map((tournament, index) => (
          <div key={index} className='flex justify-between items-center py-2 border-b border-gray-200 odd:bg-gray-200 rounded-lg px-2'>

            <div>
              {tournament.tournamentName}
            </div>

            <div className='space-x-3'>
              <button
                onClick={() => handlePreviewButtonClick(tournament)}
                className="px-2 py-1 text-gray-700 bg-white rounded-lg border border-gray-300 font-medium hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                <span className="flex items-center space-x-1">
                  <FaRegEye />
                  <span>Preview</span>
                </span>
              </button>

              {decodedJwt?.role === "ADMIN" && (
                <button onClick={() => handleDeleteButtonClick(tournament)} className="px-1.5 py-1 text-red-600 lg:text-xs xl:text-sm  bg-transparent rounded-lg border font-medium border-red-600 focus:z-10 focus:ring-1 hover:ring-1 hover:ring-red-600 focus:ring-red-600">
                  <span className="flex items-center justify-between"> <RiDeleteBin6Line /> <span className="ml-1">Delete</span> </span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
        
      <div className='text-center mt-5'>
        <Pagination totalPages={tournaments.totalPages} selectedFilters={filters} handleSelectFilter={handleSelectFilter} />
      </div>

      {isPreviewModalOpen && (
        <PreviewTournamentModal setIsModalOpen={setIsPreviewModalOpen} selectedTournament={selectedTournament} />
      )}

      {isDeleteModalOpen && (
        <DeleteTournamentModal setIsModalOpen={setIsDeleteModalOpen} selectedTournament={selectedTournament} setTournaments={setTournaments} />
      )}
    
  </div> */

  );
}
export default UpcomingTournaments;

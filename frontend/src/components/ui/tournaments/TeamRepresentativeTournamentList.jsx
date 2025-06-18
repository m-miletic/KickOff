import React, { useContext, useState } from 'react'
import { useFetchTournaments } from '../../../hooks/tournaments/useFetchTournaments';
import { ActiveModalContext } from '../../../context/ActiveModalContext';
import { FaRegEye } from "react-icons/fa";
import EnrollTournamentModal from './modal/EnrollTournamentModal';
import { jwtDecode } from "jwt-decode";
import { LoggedUserContext } from '../../../context/LoggedUserContext';

const TeamRepresentativeTournamentList = () => {

  const { decodedJwt } = useContext(LoggedUserContext)

  const [selectedTournament, setSelectedTournament] = useState();
  const [filters, setFilters] = useState({
    pageNumber: 1,
    teamRepresentativeId: decodedJwt.userId,
    tournamentId: null
  });

  const { tournaments = [], setTournaments, error, loading } = useFetchTournaments(filters);

  const { isPreviewModalOpen, setIsPreviewModalOpen } = useContext(ActiveModalContext);

  const handlePreviewButtonClick = (tournament) => {
    setSelectedTournament(tournament);
    setFilters((prev) => ({
      ...prev,
      tournamentId: tournament.id
    }));
    setIsPreviewModalOpen(true);
  };

  console.log("tournaments: ", tournaments);

  return (  
    <div className='w-[325px] sm:w-[400px] lg:w-[500px] xl:w-[600px] text-xs sm:text-sm 2xl:text-base text-gray-900 mt-20 space-y-1'>

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

          <div>
            <button
              onClick={() => handlePreviewButtonClick(tournament)}
              className="px-2 py-1 text-gray-700 bg-white rounded-lg border border-gray-300 font-medium hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              <span className="flex items-center space-x-1">
                <FaRegEye />
                <span>Preview</span>
              </span>
            </button>
          </div>

        </div>
      ))}
    </div>
      
    {isPreviewModalOpen && (
      <EnrollTournamentModal setIsModalOpen={setIsPreviewModalOpen} selectedTournament={selectedTournament} />
    )}

</div>

  );
}
export default TeamRepresentativeTournamentList;

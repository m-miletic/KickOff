import React, { useContext, useState } from 'react'
import { useFetchTournaments } from '../../../hooks/tournaments/useFetchTournaments';
import { ActiveModalContext } from '../../../context/ActiveModalContext';
import { FaRegEye } from "react-icons/fa";
import EnrollTournamentModal from './modal/EnrollTournamentModal';
import { jwtDecode } from "jwt-decode";

const TeamRepresentativeTournamentList = () => {

  let decodedJwt = null;
  const jwt = localStorage.getItem('token');
  if (jwt) {
    try {
      decodedJwt = jwtDecode(jwt);
    } catch (error) {
      console.error("Invalid JWT:", error);
    }
  };

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
    <div className='w-[325px] text-2xs text-white'>
        
        <div className='bg-[#04111a] p-3 rounded-md flex justify-between items-center'>
          <div>Tournament</div>
          <div>Preview</div>
        </div>

        <div className='p-2'>
          {tournaments.tournamentsList.map((tournament, index) => {
            return(
              <div key={index} className='flex justify-between items-center'>

                <div className='py-2'>
                  {tournament.tournamentName}
                </div>

                <div className='flex justify-center items-center space-x-1'>

                  <button onClick={() => handlePreviewButtonClick(tournament)} className="px-1.5 py-1 text-white lg:text-xs xl:text-sm  bg-transparent rounded-lg border font-medium border-gray-500 focus:z-10 focus:ring-1 hover:ring-1 hover:ring-gray-500 focus:ring-gray-500">
                    <span className="flex items-center justify-between"> <FaRegEye /> <span className="ml-1">Preview</span> </span>
                  </button>

                </div>
                
              </div>
            );
          })}
        </div>

        {isPreviewModalOpen && (
          <EnrollTournamentModal setIsModalOpen={setIsPreviewModalOpen} selectedTournament={selectedTournament} decodedJwt={decodedJwt} />
        )}


      </div>
  );
}
export default TeamRepresentativeTournamentList;

import React, { useState } from 'react'
import { useFetchUpcomingTournaments } from '../../../hooks/tournaments/useFetchTournaments';
import PreviewTournamentCard from './card/PreviewTournamentCard';
import Pagination from '../../common/navigation/Pagination';
import WeatherWidget from '../../weather/WeatherWidget';

const UpcomingTournaments = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1,
  });

  const { tournaments = [], } = useFetchUpcomingTournaments(filters.pageNumber);
  
  const handleSelectFilter = (type, value) => {
    setFilters((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
  };

  return (  
    <div className="w-[80%] mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tournaments?.tournamentsList?.length > 0 ? (
              tournaments.tournamentsList.map((tournament) => (
                <PreviewTournamentCard key={tournament.id} tournament={tournament} />
              ))
            ) : (
              <div>No Upcoming Tournaments</div>
            )}
          </div>

        <div className='text-center mt-36'>
          <Pagination totalPages={tournaments.totalPages} selectedFilters={filters} handleSelectFilter={handleSelectFilter} navButtonStyle="text-black w-5 h-5 px-4" totalPagesStyle="text-black"/>
        </div>

        <div className='mt-[80px]'>
          <WeatherWidget city="Split" style="p-4 m-8 bg-sky-100 rounded-lg shadow w-full text-center mt-[40px]" />
        </div>

      </div>
  );
}
export default UpcomingTournaments;

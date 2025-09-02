import React, { useEffect, useState } from "react";
import { fetchMatchesByTournament } from "../../../service/matchService";
import Pagination from "../../common/navigation/Pagination";

const MatchHub = ({ selectedTournament }) => {
  const [matches, setMatches] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    sortField: 'matchDate',
    direction: 'ASC'
  });
  const [initialPage, setInitialPage] = useState(1);
  
  const handleSelectFilter = (type, value) => {
    setFilters((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
  };

  useEffect(() => {
    const fetchTournamentMatches = async () => {
      try {
        const response = await fetchMatchesByTournament(selectedTournament.id, filters);
        setMatches(response.data);
        setInitialPage(response.data.page);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTournamentMatches();
  }, [selectedTournament, filters]);

  return (
    <>
      <div className="flex justify-center items-center text-white ps-6">
        <div className="bg-[#001E30] ml-64 rounded-lg py-4 pb-12 px-12 space-y-4 w-[50%]">
          <div className="text-center text-2xl">Match Hub</div>
          <div className="text-center py-2">{selectedTournament?.tournamentName}</div>

          {matches?.matchesList?.length === 0 && (
            <div className="text-center text-gray-400">No matches available.</div>
          )}

          {matches?.content?.map(match => (
            <div key={match.id}>
              <div className="text-start px-2">
                <span>{match.matchDate.substring(0, 10)} {match.matchDate.substring(11, 16)}</span>
              </div>
              <div className="flex justify-center items-center gap-x-12 py-8 bg-[#2b536c2c] rounded-lg w-full">

                <div className="flex justify-center items-center w-[40%]">
                  <div>{match.homeTeam.teamName}</div>
                  <div><img src={match.homeTeam.photoUrl} className="w-6 h-6 rounded-full mt-1 ml-3"/></div>
                </div>

                <div>
                  <span className="px-1">{match.homeTeamGoals}</span>
                  :
                  <span className="px-1">{match.awayTeamGoals}</span>
                  </div>

                <div className="flex justify-center items-center w-[40%]">
                  <div><img src={match.awayTeam.photoUrl} className="w-6 h-6 rounded-xl mt-1 mr-3"/></div>
                  <div>{match.awayTeam.teamName}</div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTournament && (
        <div className='text-center mt-8 ml-64'>
          <Pagination totalPages={matches.totalPages} initialPage={initialPage} handleSelectFilter={handleSelectFilter} navButtonStyle="text-black w-5 h-5 px-4" totalPagesStyle="text-black"/>
        </div>
      )}
    </>
  );
};

export default MatchHub;

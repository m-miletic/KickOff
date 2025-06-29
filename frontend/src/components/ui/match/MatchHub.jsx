import React, { useEffect, useState } from "react";
import { fetchMatchesByTournament, fetchMatchesByTournamentPagination } from "../../../service/matchService";
import Pagination from "../../common/navigation/Pagination";

const MatchHub = ({ selectedTournament }) => {
  const [matches, setMatches] = useState([]);

  const [filters, setFilters] = useState({
    pageNumber: 1,
  });

  const [pagesBeforeToday, setPagesBeforeToday] = useState(null);

/*   useEffect(() => {
    if (pagesBeforeToday && filters.pageNumber !== pagesBeforeToday) {
      setFilters((prevValues) => ({
        ...prevValues,
        pageNumber: pagesBeforeToday,
      }));
    }
  }, [pagesBeforeToday]); */
  


  const handleSelectFilter = (type, value) => {
    setFilters((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
  };

  useEffect(() => {
    if (!selectedTournament?.id) return;

    const fetchTournamentMatches = async () => {
      try {
        const response = await fetchMatchesByTournamentPagination(selectedTournament.id, filters.pageNumber);
        console.log("Response: ", response)
        setMatches(response.data);
        setPagesBeforeToday(response.data.pagesBeforeToday + 1)
      } catch (error) {
        console.log("Komponenta: ", error?.response?.data?.message || error.message);
      }
    };

    fetchTournamentMatches();
  }, [selectedTournament, filters.pageNumber]);



  return (
    <>
      <div className="flex justify-center items-center">
        <div className="bg-[#001E30] w-[45%] ml-64 rounded-lg py-4 pb-12 px-8 space-y-4">
          <div className="text-center text-2xl mr-6">Match Hub</div>

          {matches?.matchesList?.length === 0 && (
            <div className="text-center text-gray-400">No matches available.</div>
          )}

          {matches?.matchesList?.map(match => (
            <div key={match.id}>
              <div className="text-start px-2">
                <span>{match.matchDate.substring(0, 10)} {match.matchDate.substring(11, 16)}</span>
              </div>
              <div className="flex justify-center items-center gap-x-12 py-8 bg-[#2b536c2c] rounded-lg w-full">

                <div className="flex justify-center items-center w-[40%]">
                  <div>{match.homeTeam.teamName}</div>
                  <div><img src={match.homeTeam.photoUrl} className="w-5 h-5 rounded-full mt-1 ml-3"/></div>
                </div>

                <div>
                  <span className="px-1">{match.homeTeamGoals}</span>
                  :
                  <span className="px-1">{match.awayTeamGoals}</span>
                  </div>

                <div className="flex justify-center items-center w-[40%]">
                  <div><img src={match.awayTeam.photoUrl} className="w-5 h-5 rounded-xl mt-1 mr-3"/></div>
                  <div>{match.awayTeam.teamName}</div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {pagesBeforeToday && (
        <div className='text-center mt-8 ml-64'>
          <Pagination pagesBeforeToday={pagesBeforeToday} totalPages={matches.totalPages} selectedFilters={filters} handleSelectFilter={handleSelectFilter} navButtonStyle="text-black w-5 h-5 px-4" totalPagesStyle="text-black"/>
        </div>
      )}

    </>
  );
};

export default MatchHub;

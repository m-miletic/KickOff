import React, { useEffect, useState } from "react";
import { fetchMatchesByTournament } from "../../../service/matchService";

const MatchHub = ({ selectedTournament }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!selectedTournament?.id) return;

    const fetchTournamentMatches = async () => {
      try {
        const response = await fetchMatchesByTournament(selectedTournament.id);
        setMatches(response.data);
      } catch (error) {
        console.log("Komponenta: ", error?.response?.data?.message || error.message);
      }
    };

    fetchTournamentMatches();
  }, [selectedTournament]);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#001E30] w-[43%] ml-64 rounded-lg py-4 pb-12 px-8 space-y-4">
        <div className="text-center text-2xl mr-6">Match Hub</div>

        {matches.length === 0 && (
          <div className="text-center text-gray-400">No matches available.</div>
        )}

        {matches.map(match => (
          <div key={match.id}>
            <div className="text-start px-2">
              <span>{match.matchDate.substring(0, 10)} {match.matchDate.substring(11, 16)}</span>
            </div>
            <div className="flex justify-center items-center gap-x-12 py-8 bg-[#2b536c2c] rounded-lg">

              <div className="flex justify-center items-center">
                <div>{match.homeTeam.teamName}</div>
                <div><img src={match.homeTeam.photoUrl} className="w-5 h-5 rounded-full mt-1 ml-3"/></div>
              </div>

              <div>
                <span className="px-1">{match.homeTeamGoals}</span>
                :
                <span className="px-1">{match.awayTeamGoals}</span>
                </div>

              <div className="flex justify-center items-center">
                <div><img src={match.awayTeam.photoUrl} className="w-5 h-5 rounded-xl mt-1 mr-3"/></div>
                <div>{match.awayTeam.teamName}</div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHub;

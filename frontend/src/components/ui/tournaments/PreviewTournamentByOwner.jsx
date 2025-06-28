import React, { useState } from "react";
import { Link } from "react-router-dom";

const PreviewTournamentByOwner = ({ tournament }) => {
  const [showAllMatches, setShowAllMatches] = useState(false);


  const matches = tournament?.matchesList || [];
  const displayMatches = showAllMatches ? matches : matches.slice(0, 3);


  return(
    <div className="flex flex-col space-y-4 text-[10px] sm:text-[13px] lg:text-[15px]">
      <div className="bg-[#001E28] rounded-lg py-4">
        <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Tournament Details</div>
        <div className="mt-4 px-10">
          <div>
            Maximum teams allowed to enrrol tournament: {tournament.maxTeams}
          </div>
          <div className="py-[2px]">
            {tournament?.details || "No details provided."}
          </div>
        </div>
      </div>

    <div className="bg-[#001E28] rounded-lg py-4">
      <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Matches</div>
      <div className="mt-4 px-10">
      {displayMatches.length > 0 ? (
        displayMatches.map((match, index) => (
          <div key={index} className="py-[2px] flex justify-start items-center">
            <span className="mr-2 text-[10px] sm:text-[13px] lg:text-[15px]">•</span>
            <div className="text-[10px] sm:text-[13px] lg:text-[15px]">
              {match.homeTeam.teamName} <span className="text-[10px] sm:text-[13px] lg:text-[15px]">VS</span> {match.awayTeam.teamName}
            </div>
          </div>
        ))
        ) : (
          <div>No matches scheduled yet.</div>
        )}
        {matches.length > 3 && (
          <button
            className="mt-3 text-blue-600 underline"
            onClick={() => setShowAllMatches(!showAllMatches)}
          >
            {showAllMatches ? "Show Less" : "Show All ..."}
          </button>
        )}
      </div>
    </div>

    <div className="bg-[#001E28] rounded-lg py-4">
      <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Teams</div>
      <div className="mt-4 px-10">
        {tournament?.teams?.length > 0 ? (
          tournament.teams.map((team, index) => (
            <div key={index} className="py-[2px]">
              <Link to={`/teams/${team.id}`} className="hover:underline hover:text-blue-400">
                {team.teamName}
              </Link>
            </div>
          ))
        ) : (
          <div>No teams added yet.</div>
        )}
      </div>
    </div>

    <div className="bg-[#001E28] rounded-lg py-4">
      <div className="px-10 text-[10px] sm:text-[13px] lg:text-[15px] font-semibold">Date</div>
      <div className="mt-4 px-10 space-y-2">
        <div className="flex">
          <div className="w-24 font-medium">Start Date:</div>
          <div>{tournament.startDate}</div>
        </div>
        <div className="flex">
          <div className="w-24 font-medium">End Date:</div>
          <div>{tournament.endDate}</div>
        </div>
      </div>
    </div>
  </div>
  );
}
export default PreviewTournamentByOwner;
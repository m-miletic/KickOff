import React, { useState } from "react";
import { useFetchTeams } from "../../../hooks/team/useTeamHook";
import Pagination from "../../common/navigation/Pagination";
import TeamCard from "./card/TeamCard";

const TeamList = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filters, setFilters] = useState({
    pageNumber: 1
  });

  const handleSelectFilter = (type, filter) => {
    setFilters((prev) => ({
      ...prev,
      [type]: filter,
    }));
  };

  const { teams = [], setTeams } = useFetchTeams(filters);

  console.log("Teams: ", teams)

  return (
    <div className="px-20 py-6">
      <div className="max-w-[750px] mx-auto">
        <div className="grid grid-cols-2 gap-6">
          {teams?.teamsList.length > 0 &&
            teams?.teamsList.map((team) => (
              <TeamCard key={team.id} team={team} setTeams={setTeams}/>
            ))}
        </div>
  
        {teams?.teamsList.length > 0 ? (
          <div className="text-center mt-6">
            <Pagination
              totalPages={teams.totalPages}
              selectedFilters={filters}
              handleSelectFilter={handleSelectFilter}
              navButtonStyle="text-black w-5 h-5 px-4"
              totalPagesStyle="text-black"
            />
          </div>
        ) : (
          <div>No Teams Created Yet</div>
        )}
      </div>
    </div>
  );
  
}
export default TeamList;
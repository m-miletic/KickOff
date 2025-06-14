import React, { useState } from "react";
import { useFetchTeamsByTournament } from "../../hooks/team/useTeamHook";
import { DropdownButton } from "../common/dropdown/DropdownButton";
import { useFetchTournaments } from "../../hooks/tournaments/useFetchTournaments";
import DropdownContent from "../common/dropdown/DropdownContent";
import { useNavigate } from "react-router-dom";

const Standings = () => {
  const [filterTeams, setFilterTeams] = useState({
    tournamentName: 'Select tournament',
    pageSize: 20 // max broj ekipa u ligi je 20, u standings-u  ne zelim paginaciju nego prikazati tablicu sa svim timovima lige
  });
  // jel ok koristit isti filters objekt za dohvacanje timova i turnira?
  const { teams, loading, error } = useFetchTeamsByTournament(filterTeams);
  const { tournaments } = useFetchTournaments(filterTeams); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();

  // potrebno jer ne izgleda svaki response isto na ovaj nacin dropdownContent alko primi uvik isti format tocno zna sta displayat
  // isto je formatiran REQUEST_STATUS i REQUEST_TIME_CREATED
  const dropdownItems = tournaments.tournamentsList.map(tournament => ({
    label: tournament.tournamentName,
    value: tournament.id
  }));

  const handleSelectFilter = ( type, value ) => {
    setFilterTeams((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
    setIsDropdownOpen(false);
  };

  const handleShowTeamPage = (teamId) => {
    navigate(`/teams/${teamId}`)
  };

  return (
    <div className="text-white overflow-x-scroll sm:overflow-hidden bg-[#04111a] rounded-lg px-4 py-6">
      
      <div className="mb-2">
        <DropdownButton
          title={filterTeams.tournamentName}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />

        {isDropdownOpen  && (
          <DropdownContent 
            values={dropdownItems}
            filterType={'tournamentName'}
            onSelect={handleSelectFilter}
          />
        )}
      </div>

      {loading && (
        <div className="text-center text-sm text-gray-400 py-4">
          Loading teams...
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-red-500 py-4">
          Error fetching teams: {error.message || "Unknown error"}
        </div>
      )}

      <div className="flex items-center bg-[#001E30] w-[500px] p-1 rounded-lg text-[11px]">
        <div className="w-[25px] sticky left-0 bg-[#001E30] z-10 px-1">#</div>
        <div className="w-[125px] sticky left-[25px] bg-[#001E30] z-10 text-start">Team</div>
        <div className="w-[30px] px-1">MP</div>
        <div className="w-[30px] px-1">W</div>
        <div className="w-[30px] px-1">D</div>
        <div className="w-[30px] px-1">L</div>
        <div className="w-[30px] px-1">G</div>
        <div className="w-[30px] px-1">GD</div>
        <div className="w-[30px] px-1">PTS</div>
        <div className="w-[140px] text-center">FORM</div>
      </div>

      <div className="py-2">
        {teams && teams.map((team) => {
          return(
            <div key={team.id} className="flex items-center w-[500px] text-[11px] border-b border-white/15">
              <div className="w-[25px] sticky left-0 z-20 bg-[#04111a] h-full flex items-center px-2">
                1
              </div>
              <div className="w-[125px] sticky left-[25px] z-20 bg-[#04111a] h-full flex items-center py-[3px] border-r border-white/10">
                <span className="block w-[75px] overflow-hidden text-ellipsis whitespace-nowrap">
                  <button onClick={() => handleShowTeamPage(team.id)} className="hover:underline">{team.teamName}</button>
                </span>
              </div>
              <div className="w-[30px] px-2">{team.matchesPlayed}</div>
              <div className="w-[30px] px-1">{team.wins}</div>
              <div className="w-[30px] px-1">{team.draws}</div>
              <div className="w-[30px] px-1">{team.losses}</div>
              <div className="w-[30px] px-1">{team.goalsScored}</div>
              <div className="w-[30px] px-1">{team.goalsAgainst}</div>
              <div className="w-[30px] px-1">66</div>
              <div className="w-[140px] flex justify-center items-center text-[9px] gap-x-[4px] py-2">
                <div className="bg-green-600 px-[6px] py-[2px] rounded-sm">W</div>
                <div className="bg-yellow-400 px-[6px] py-[2px] rounded-sm">D</div>
                <div className="bg-yellow-400 px-[6px] py-[2px] rounded-sm">D</div>
                <div className="bg-red-600 px-[6px] py-[2px] rounded-sm">L</div>
                <div className="bg-yellow-400 px-[6px] py-[2px] rounded-sm">D</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Standings;


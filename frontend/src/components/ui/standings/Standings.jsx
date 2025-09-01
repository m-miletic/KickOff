import React, { useEffect, useState } from "react";
import { DropdownButton } from "../../common/dropdown/DropdownButton";
import DropdownContent from "../../common/dropdown/DropdownContent";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllActiveTournaments } from "../../../service/tournamentService";

const Standings = ({ selectedTournament, setSelectedTournament }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllActiveTournaments();
        if (!response.success) {
          throw new Error('Failed to fetch data.');
        }
        setTournaments(response.data);
      } catch (error) {
        setError("Unable to fetch torunament data!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Tournaments: ", tournaments);

  if (loading) return <p className="text-black flex justify-center">Loading...</p>
  if (error) return <p className="text-black flex justify-center">{error}</p>
  if (!tournaments) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownContentItems = tournaments.tournamentsList.map(tournament => ({
    label: tournament.tournamentName,
    value: tournament.id
  }));

  const handleSelectFilter = (value) => {
    const selected = tournaments.tournamentsList.find(t => t.id === value);
    if(selected) {
      setSelectedTournament(selected);
    }
    setIsDropdownOpen(false);
  };
  
  const handleShowTeamPage = (id) => {
    navigate(`/teams/${id}`);
  };

  return (
    <div className="flex justify-center">

      <aside>
        <div className="bg-[#001E30] rounded-lg mr-2 w-[250px] p-4 text-white space-y-2 shadow-md text-sm">
          <div className="font-semibold text-base border-b border-white/10 pb-2">
            Team Stats
          </div>
          <div className="flex"><span className="w-12 inline-block">W</span>Games Won</div>
          <div className="flex"><span className="w-12 inline-block">D</span>Draws</div>
          <div className="flex"><span className="w-12 inline-block">L</span>Losses</div>
          <div className="flex"><span className="w-12 inline-block">GF</span>Goals For</div>
          <div className="flex"><span className="w-12 inline-block">GA</span>Goals Against</div>
          <div className="flex"><span className="w-12 inline-block">GD</span>Goal Difference</div>
          <div className="flex"><span className="w-12 inline-block">PTS</span>Points Earned</div>
        </div>
      </aside>

      <div className="text-white overflow-x-scroll sm:overflow-hidden bg-[#04111a] rounded-lg px-4 py-6"> {/* bg-opacity-70  */}
        
        <div className="mb-2">
          <DropdownButton
            title={selectedTournament?.tournamentName || "Select Tournament"}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
          />

          {isDropdownOpen  && (
            <DropdownContent 
              values={dropdownContentItems}
              onSelect={handleSelectFilter}
            />
          )}
        </div>

        <div className="flex items-center bg-[#001E30] w-[625px] p-1 rounded-lg text-[11px] xl:text-[13px]">
          <div className="w-[40px] sticky left-0 bg-[#001E30] z-10 px-1">#</div>
          <div className="w-[258px] sticky left-[30px] bg-[#001E30] z-10 text-start">Team</div>
          <div className="w-[35px] px-2">W</div>
          <div className="w-[35px] px-2">D</div>
          <div className="w-[35px] px-2">L</div>
          <div className="w-[35px] px-1">GF</div>
          <div className="w-[35px] px-1">GA</div>
          <div className="w-[35px] px-1">GD</div>
          <div className="w-[35px] px-1">PTS</div>

        </div>

        <div className="space-y-2">
          {selectedTournament?.teams && selectedTournament?.teams.map((team, index) => {
            return (
              <div key={team.id} className="flex items-center w-[655px] text-[11px] sm:text-[13px] xl:text-[17px] border-b border-white/15">
                <div className="w-[30px] sticky left-0 z-20 bg-[#04111a] h-full flex items-center px-2">
                  {index + 1}
                </div>
                <div className="w-[270px] sticky left-[30px] z-20 bg-[#04111a] h-full flex items-center py-[3px] border-r border-white/10">
                  <span className="w-[125px] sm:w-[150px] xl:w-auto overflow-hidden text-ellipsis whitespace-nowrap flex items-center justify-center">
                    {team.photoUrl ? (
                      <img src={team.photoUrl} className="w-4 h-4 rounded-full mr-2 mt-[2px]" />
                    ) : (
                      <span className="w-4"></span>
                    )}  

                    <Link to={`/team/${team.id}`}>
                      <span className="hover:underline">{team.teamName}</span>
                    </Link>

                  </span>
                </div>
                <div className="w-[35px] px-3">{team.wins}</div>
                <div className="w-[35px] px-3">{team.draws}</div>
                <div className="w-[35px] px-3">{team.losses}</div>
                <div className="w-[35px] px-3">{team.goalsScored}</div>
                <div className="w-[35px] px-3">{team.goalsAgainst}</div>
                <div className="w-[35px] px-3">{team.goalsScored - team.goalsAgainst}</div>
                <div className="w-[35px] px-3">{team.points}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Standings;


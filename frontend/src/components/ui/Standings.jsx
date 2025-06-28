import React, { useState } from "react";
import { useFetchTeamsByTournament } from "../../hooks/team/useTeamHook";
import { DropdownButton } from "../common/dropdown/DropdownButton";
import { useFetchActiveTournaments } from "../../hooks/tournaments/useFetchTournaments";
import DropdownContent from "../common/dropdown/DropdownContent";
import { useNavigate } from "react-router-dom";

const Standings = ({selectedTournament, setSelectedTournament}) => {
/*   const [selectedTournament, setSelectedTournament] = useState("") */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { tournaments } = useFetchActiveTournaments(); 
/*   const { teams, loading, error } = useFetchTeamsByTournament(selectedTournament?.id); */

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // potrebno jer ne izgleda svaki response isto na ovaj nacin dropdownContent alko primi uvik isti format tocno zna sta displayat
  // isto je formatiran REQUEST_STATUS i REQUEST_TIME_CREATED
  const dropdownItems = tournaments.tournamentsList.map(tournament => ({
    label: tournament.tournamentName,
    value: tournament.id
  }));

  const handleSelectFilter = (type, value) => {
    console.log("Handle Select Filter -> type=",type , " value=",value )
    const selected = tournaments.tournamentsList.find(t => t.id === value);
    console.log("Selected: ", selected)
    if(selected) {
      setSelectedTournament(selected);
    }
  
    setIsDropdownOpen(false);
  };
  
  const handleShowTeamPage = (id) => {
    navigate(`/teams/${id}`)
  };


  console.log("****** SELECTED TOURNAMENT **********", selectedTournament)

  return (
    <div className="flex justify-center">

      <aside>
        <div className="bg-[#001E30] rounded-lg mr-2 w-[250px] p-4 text-white space-y-2 shadow-md text-sm">
          <div className="font-semibold text-base border-b border-white/10 pb-2">
            Team Stats
          </div>
          <div className="flex"><span className="w-12 inline-block">MP</span>Matches Played</div>
          <div className="flex"><span className="w-12 inline-block">W</span>Games Won</div>
          <div className="flex"><span className="w-12 inline-block">D</span>Draws</div>
          <div className="flex"><span className="w-12 inline-block">L</span>Losses</div>
          <div className="flex"><span className="w-12 inline-block">GF</span>Goals For</div>
          <div className="flex"><span className="w-12 inline-block">GA</span>Goals Against</div>
          <div className="flex"><span className="w-12 inline-block">GD</span>Goal Difference</div>
          <div className="flex"><span className="w-12 inline-block">PTS</span>Points</div>
          <div className="flex"><span className="w-12 inline-block">FORM</span>Result in Last 5 Matches</div>
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
              values={dropdownItems}
              filterType={'tournamentName'}
              onSelect={handleSelectFilter}
            />
          )}
        </div>

{/*         {loading && (
          <div className="text-center text-sm text-gray-400 py-4">
            Loading teams...
          </div>
        )} */}

        <div className="flex items-center bg-[#001E30] w-[625px] p-1 rounded-lg text-[11px] xl:text-[13px]">
          <div className="w-[30px] sticky left-0 bg-[#001E30] z-10 px-1">#</div>
          <div className="w-[180px] sticky left-[30px] bg-[#001E30] z-10 text-start">Team</div>
          <div className="w-[35px] px-1">MP</div>
          <div className="w-[35px] px-1">W</div>
          <div className="w-[35px] px-1">D</div>
          <div className="w-[35px] px-1">L</div>
          <div className="w-[35px] px-1">GF</div>
          <div className="w-[35px] px-1">GA</div>
          <div className="w-[35px] px-1">GD</div>
          <div className="w-[35px] px-1">PTS</div>
          <div className="w-[170px] text-center flex items-center justify-center gap-1">
            FORM
            <div className="relative group">
              <span className="text-white text-xs cursor-pointer bg-white/20 ml-2 rounded-full w-4 h-4 flex items-center justify-center">i</span>
              <div className="absolute bottom-full mb-2 ml-8 left-1/2 -translate-x-1/2 w-max max-w-[160px] bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                Last 5 matches
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-2">

          {selectedTournament?.teams && selectedTournament?.teams.map((team, index) => {
            return (
              <div key={team.id} className="flex items-center w-[655px] text-[11px] sm:text-[13px] xl:text-[15px] border-b border-white/15">
                <div className="w-[30px] sticky left-0 z-20 bg-[#04111a] h-full flex items-center px-2">
                  {index + 1}
                </div>
                <div className="w-[180px] sticky left-[30px] z-20 bg-[#04111a] h-full flex items-center py-[3px] border-r border-white/10">
                  <span className="w-[125px] sm:w-[150px] xl:w-auto overflow-hidden text-ellipsis whitespace-nowrap flex items-center justify-center">
                    {team.photoUrl ? (
                      <img src={team.photoUrl} className="w-4 h-4 rounded-full mr-2 mt-[2px]" />
                    ) : (
                      <span className="w-4"></span>
                    )}

                    <button
                      onClick={() => handleShowTeamPage(team.id)}
                      className="hover:underline"
                      >
                      {team.teamName} 
                    </button>
                  </span>
                </div>
                <div className="w-[35px] px-1">{team.matchesPlayed}</div>
                <div className="w-[35px] px-1">{team.wins}</div>
                <div className="w-[35px] px-1">{team.draws}</div>
                <div className="w-[35px] px-1">{team.losses}</div>
                <div className="w-[35px] px-1">{team.goalsScored}</div>
                <div className="w-[35px] px-1">{team.goalsAgainst}</div>
                <div className="w-[35px] px-1">66</div>
                <div className="w-[170px] flex justify-center items-center text-[9px] sm:text-[10px] gap-x-[4px] py-2">
                  {(() => {
                    const lastFive = team.allMatches?.slice(-5) || [];
                    const outcomeElements = lastFive.map((match) => {
                      let outcome = '';
                      if (match.isHomeMatch) {
                        if (match.homeTeamGoals > match.awayTeamGoals) {
                          outcome = 'W';
                        } else if (match.homeTeamGoals < match.awayTeamGoals) {
                          outcome = 'L';
                        } else {
                          outcome = 'D';
                        }
                      } else {
                        if (match.awayTeamGoals > match.homeTeamGoals) {
                          outcome = 'W';
                        } else if (match.awayTeamGoals < match.homeTeamGoals) {
                          outcome = 'L';
                        } else {
                          outcome = 'D';
                        }
                      }

                      const bgColor =
                        outcome === 'W'
                          ? 'bg-green-600'
                          : outcome === 'L'
                          ? 'bg-red-600'
                          : 'bg-yellow-400';

                      return (
                        <div
                          key={match.id}
                          className={`${bgColor} px-[6px] py-[2px] rounded-sm`}
                        >
                          {outcome}
                        </div>
                      );
                    });

                    // Fill remaining with "?" (gray)
                    const fillersNeeded = 5 - outcomeElements.length;
                    for (let i = 0; i < fillersNeeded; i++) {
                      outcomeElements.unshift(
                        <div
                          key={`placeholder-${team.id}-${i}`}
                          className="bg-gray-500 px-[7px] py-[2px] rounded-sm"
                        >
                          ?
                        </div>
                      );
                    }

                    return outcomeElements;
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Standings;


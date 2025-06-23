import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/navigation/Navbar";
import { getTeam } from "../service/teamService";
import defaultPlayerImg from '../assets/defaultPlayerImg.jpg';
import Footer from "../components/common/footer/Footer";

const TeamPage = () => {
  const [team, setTeam] = useState({});
  const { id } = useParams();
  const [showPlayerInfo, setShowPlayerInfo] = useState("")

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await getTeam(id);
        setTeam(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load team");
      }
    };

    fetchTeam();
  }, [id]);

  const handleSeeMoreClick = (playerId) => {
    setShowPlayerInfo((prevPlayerId) => prevPlayerId === playerId ? "" : playerId)
  };

  return (
    <div className="w-full">
      <Navbar />

      {/* Team Header */}
      <div className="flex justify-center items-center">
        <div className="bg-[#001E30] text-white p-8 rounded-md w-[60%] space-y-4 shadow-md mt-6">
          <div className="flex items-center">
            <div className="w-24 h-24">
              <img
                src={team.photoUrl}
                alt="Team Logo"
                className="w-full h-full object-contain rounded-md"
              />
            </div>

            <div className="ml-4">
              <div className="text-lg text-gray-300">Team</div>
              <div className="text-xl font-semibold">{team.teamName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Roster Title */}
      <div className="flex items-start justify-center mt-8">
        <div className="bg-[#001E30] text-white p-6 rounded-md w-[60%] space-y-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Team Roster</div>
          </div>
        </div>
      </div>

      {/* Player Cards */}
      <div className="flex justify-center mt-4">
        <div className="w-[60%]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 auto-rows-auto">
            {team.players?.map((player, index) => (
              <div
                key={player.id || index}
                className="bg-[#001E30] rounded-md p-7 text-white shadow-md flex flex-col items-center self-start"
              >
                <div>
                  <img
                    className="w-24 h-24 rounded-full mb-3 object-cover"
                    src={player.photoUrl || defaultPlayerImg}
                    alt={`${player.firstName} ${player.lastName}`}
                  />
                </div>
                <div className="text-center font-medium">
                  {player.firstName} {player.lastName}
                </div>

                {showPlayerInfo === player.id ? (
                  <div className="mt-4 w-full text-sm text-gray-300 space-y-2">
                    <div><strong>Goals:</strong> {player.goals}</div>
                    <div><strong>Assists:</strong> {player.assists}</div>
                    <div><strong>Age:</strong> {player.age}</div>
                    <div><strong>Height:</strong> {player.height} cm</div>
                    <button onClick={() => handleSeeMoreClick(player.id)} className="mt-2 text-sm text-blue-300 hover:underline cursor-pointer">
                      See Less
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleSeeMoreClick(player.id)} className="mt-2 text-sm text-blue-300 hover:underline cursor-pointer">
                    See More
                  </button>
                )}
 
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeamPage;

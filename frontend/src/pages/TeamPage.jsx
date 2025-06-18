import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/navigation/Navbar";
import { fetchPlayersByTeamId } from "../service/playerService";

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const { id } = useParams();
  const [players, setPlayers] = useState([]);

  // ubacit u servis
  useEffect(() => {
    const getTeamById = async () => {
      const response = await axios.get(`http://localhost:8080/api/teams/${id}`)
      setTeam(response.data.data)
    };
    getTeamById();
  }, [id]);




  // find players by team

  useEffect(() => {
    if(!team?.id) return;

    const getPlayersByTeamId = async () => {
      const fetchObj = {
        teamId: team.id
      }
      const response = await fetchPlayersByTeamId(fetchObj)
      setPlayers(response);
    }

    getPlayersByTeamId();
  }, [team.id]);

  return(
    <div>
      <Navbar />
      <div className='justify-center items-center flex'>
        <div className='bg-[#001E30] text-white p-4 rounded-md w-[40%] mt-8'>
          <div className='flex'>
            <div className='w-24 h-16 flex items-center '>
              <img src={team.teamCrest} alt="" className="w-full h-full object-contain " />
            </div>
            <div className=' w-96 h-16 ml-2'>
              <div>Team</div> 
              <div>{team.teamName}</div>
            </div>
          </div>
        </div>
      </div>  

      <div className="w-[60%] h-8 flex justify-center mt-6">
        <h1 className="text-white">Players</h1>
      </div>

      <div className="flex justify-center mx-auto mt-6 w-[50%]">
        <div className="grid grid-cols-4 gap-4 w-full text-center">
          {players.map((player, index) => (
            <div key={player.id || index} className="bg-[#001E30] h-56 p-2 rounded text-white">
              <div className="h-[70%]">
              <img className='w-28 h-28 rounded-full mb-3 flex items-center justify-center text-sm' src={player.photoUrl} />
              </div>
              <div>{player.firstName} {player.lastName}</div>
            </div>
          ))}
        </div>
      </div>



    </div>  


  );
}
export default TeamPage;
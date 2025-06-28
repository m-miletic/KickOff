import React, { useContext, useEffect, useState } from 'react';
import { LoggedUserContext } from '../../../context/LoggedUserContext';
import { getMyTeam, updateTeamImage } from '../../../service/teamService';
import FileUpload from '../files/FileUpload';
import defaultPlayerImg from '../../../assets/defaultPlayerImg.jpg';
import { MdOutlineModeEdit } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { toast } from 'react-toastify';
import AddPlayerForm from '../player/AddPlayerForm';
import EditPlayerForm from '../player/EditPlayerForm';
import DeletePlayerForm from '../player/DeletePlayerForm';

const MyTeam = () => {
  const { decodedJwt } = useContext(LoggedUserContext);
  const [team, setTeam] = useState("")
  const [error, setError] = useState("")

  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const [showEditPlayerForm, setShowEditPlayerForm] = useState(false)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showEditTeamForm, setShowEditTeamForm] = useState(false)
  const [selectedTeamImage, setSelectedTeamImage] = useState("")
  const [previewTeamImage, setPreviewTeamImage] = useState(false) 


/*   // custom hook ! ********************+
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await getTeamByTeamRepresentative(decodedJwt.userId)
        setTeam(response.data)
      } catch (error) {
        setError(error.response.data.data.message)
        console.log("this error: ", error.response.data.data.message)
      }
    };
    fetchTeam()
    fetchTeam()
  }, [decodedJwt, jwt]); */


  // na page render jwt jos nije loadan
  useEffect(() => {
    if (!decodedJwt) return;
    const getMyTeamData = async () => {
      try {
        const response = await getMyTeam(decodedJwt?.userId)
        setTeam(response.data)
      } catch (error) {
        console.log("Error messaage: ", error.data.message)
      }
    }

    getMyTeamData();
  }, [decodedJwt])


  // ✅ team na prvi render je undefined 
/*   useEffect(() => {
    if (team?.id) {
      setAddPlayerForm((prev) => ({
        ...prev,
        teamId: team.id,
      }));
    }
  }, [team]);
 */



/*     const [editPlayerForm, setEditPlayerForm] = useState({
      goals: '',
      assists: '',
      firstName: '',
      lastName: '',
      age: '',
      height: '',
    });

 */

  const handleEditPlayerClick = (playerId) => {
    const playerToEdit = team.players.find(p => p.id === playerId);
  
    // If the same player is clicked again, close the form
    if (selectedPlayer?.id === playerId && showEditPlayerForm) {
      setSelectedPlayer(null);
      setShowEditPlayerForm(false);
    } else {
      setSelectedPlayer(playerToEdit);
      setShowEditPlayerForm(true);
    }
  
    setShowPlayerInfo(false);
  };
    

  const handleDeletePlayerClick = (playerId) => {
    const playerToDelete = team.players.find(p => p.id === playerId);

    setShowEditPlayerForm(false);
    setShowPlayerInfo(false)
  
    if (selectedPlayer?.id === playerId && showDeleteConfirmation) {
      setSelectedPlayer(null);
      setShowDeleteConfirmation(false);
    } else {
      setSelectedPlayer(playerToDelete);
      setShowDeleteConfirmation(true);
    }

    setSelectedPlayer(playerToDelete);
  };

  
  const handleAddPlayerClick = () => {
    setShowAddPlayerForm(!showAddPlayerForm)
    setShowEditPlayerForm(false)
    setShowPlayerInfo(false)
  };
  
  const handleSeeMoreClick = (playerId) => {
    setShowEditPlayerForm(false)
    setShowPlayerInfo((prevPlayerId) => prevPlayerId === playerId ? "" : playerId)
  };

  const handleEditTeamClick = () => {
    setShowEditTeamForm(!showEditTeamForm)
    setPreviewTeamImage('')
  };


  const handleEditTeamFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
  
      if (selectedTeamImage) {
        const data = new FormData();
        data.append("file", selectedTeamImage);
        data.append("upload_preset", "app_images");
        data.append("cloud_name", "dcjkglnuw");
  
        const res = await fetch("https://api.cloudinary.com/v1_1/dcjkglnuw/image/upload", {
          method: "POST",
          body: data,
        });
  
        const uploadResult = await res.json();
        imageUrl = uploadResult.url;
      }
  
      const body = { photoUrl: imageUrl };
  
      const response = await updateTeamImage(team.id, body)

      if (response.success) {
        toast.success("Image Updated!", {
          autoClose: 2500
        });
        setShowEditTeamForm(false);
        setPreviewTeamImage('')
        setSelectedTeamImage('')
      } else {
        console.error("Failed to update team image");
      }

      const newPhotoUrl = response.data;
  
      setTeam((prevTeam) => ({
        ...prevTeam,
        photoUrl: newPhotoUrl,
      }));
  
    } catch (error) {
      console.error(error);
    }
  };




  if (error) {
    return(
      <div className='text-xl flex justify-center items-center mt-20'>
        {error} <span className='ml-3 mt-1'><IoWarning /></span>
      </div>
    )
  }

  if (!team) return "Doesnt represent a team yet";

  

  return (
    <div className="w-full">
      <div className="flex justify-center items-center">
        <div className="bg-[#001E30] text-white p-8 rounded-md w-[60%] space-y-4 shadow-md">

          {/* Top: Team Header */}
          <div className="flex items-center">
            {/* Team Logo */}
            <div className="w-24 h-24 cursor-pointer">
              <img
                onClick={handleEditTeamClick}
                src={team.photoUrl}
                className="w-full h-full object-contain rounded-md hover:opacity-80"
              />
              <div className='text-xs text-gray-300 hover:underline flex items-center justify-center mt-1'>
                <button onClick={handleEditTeamClick}>
                  Edit Image
                </button>
                <span className='ml-1'><MdOutlineModeEdit /></span>
              </div>

            </div>

            {/* Team Name  */}
            <div className="ml-4">
              <div className="text-lg text-gray-300">Team</div>
              <div className="text-xl font-semibold">{team.teamName}</div>
            </div>

            {/* show edit team */}
            {showEditTeamForm && (
              <div className="ml-auto">
                <form onSubmit={handleEditTeamFormSubmit}>
                  <div className="space-y-4 mt-10 pl-44 text-end">
                    <div className='pl-3'>
                      <FileUpload
                        buttonStyle={"px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition"}
                        previewUrl={previewTeamImage}
                        setPreviewUrl={setPreviewTeamImage}
                        setSelectedFile={setSelectedTeamImage}
                        label='Choose Team Image'
                      />
                    </div>
                    <div>
                      <button className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition ' type='submit'>Change</button>
                      <button onClick={handleEditTeamClick} className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition ml-3'>Cancel</button>
                    </div>
                  </div>

                </form>      
              </div>
            )}
          </div>
        </div>
      </div>


      <div className='flex items-start justify-center mt-8'>
        <div className='bg-[#001E30] text-white p-6 rounded-md w-[60%] space-y-4 shadow-md'>
          <span className='text-xl font-semibold'>Enrolled Tournament:</span>
          {team.tournament?.tournamentName ? (
            <span className='text-lg ml-4'>{team.tournament.tournamentName}</span>
          ) : (
            <span className='text-lg ml-4'>Doesn't participate in any tournaments</span>
          )}
        </div>
      </div>


      <div className='flex items-start justify-center mt-8'>
        <div className='bg-[#001E30] text-white p-6 rounded-md w-[60%] space-y-4 shadow-md'>
          <span className='text-xl font-semibold'>Team Matches:</span>
          {team.allMatches && team.allMatches.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
            {team.allMatches.map((match) => (
              <div key={match.id}>
                <div>{new Date(match.matchDate).toLocaleString()}</div>
                <div className='bg-gray-800 p-4 rounded-lg text-center'>
                  {match.name}
                </div>
              </div>
            ))}
            
          </div>
          ) : (
            <span className='text-lg ml-4'>Doesn't have scheduled matches yet</span>
          )}
        </div>
      </div>

      


      <div className="flex items-start justify-center mt-8">
        <div className="bg-[#001E30] text-white p-6 rounded-md w-[60%] space-y-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Team Roster</div>
            {showAddPlayerForm ? (
              <button onClick={handleAddPlayerClick} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                Show Players
              </button>
            ) : (
              <button onClick={handleAddPlayerClick} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition">
                Add Player
              </button>
            )}

          </div>
        </div>
      </div>
      

      {/* Add Player */}
      {showAddPlayerForm ? (
        <div className='flex justify-center mt-6'>
          <div className='w-[60%] bg-[#001E30] p-4 h-auto rounded py-4'>
            <h1 className='text-white text-center text-xl font-semibold'>Add Player</h1>
              <AddPlayerForm team={team} setTeam={setTeam}  />
          </div>
        </div> 
      ) : (
      /* display teams players */
      <div className="flex justify-center mt-4">
        <div className="w-[60%]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
            {team.players?.map((player, index) => (
              <div
                key={player.id || index}
                className="bg-[#001E30] rounded-md p-7 text-white shadow-md flex flex-col items-start h-auto self-start"
              >
              {/* ako je kliknut delete prikazi ovo */}
              {showDeleteConfirmation && selectedPlayer?.id === player.id ? (
                <DeletePlayerForm selectedPlayer={selectedPlayer} setShowDeleteConfirmation={setShowDeleteConfirmation} setTeam={setTeam} />
                

                /* inace pokazi normalno */
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <div>
                      {player.photoUrl ? (
                        <img className='w-24 h-24 rounded-full mb-3 flex items-center justify-center text-sm' src={player.photoUrl} />
                      ) : (
                        <img className='w-24 h-24 rounded-full mb-3 flex items-center justify-center text-sm' src={defaultPlayerImg} />
                      )}
                    </div>
                    <div className="text-center font-medium">
                      {player.firstName} {player.lastName}
                    </div>
                    <div className='flex justify-center items-center space-x-3'>
                      <button onClick={() => handleEditPlayerClick(player.id)} className="px-3 py-1 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition w-16">
                        Edit
                      </button>
                      <button onClick={() => handleDeletePlayerClick(player.id)} className="px-3 py-1 mt-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition w-16">
                        Delete
                      </button>
                    </div>

                    {/* Collapsed: Show "See more" button */}
                    {showPlayerInfo !== player.id && (
                      <div className="mt-2 text-center w-full">
                        <button
                          onClick={() => handleSeeMoreClick(player.id)}
                          className="text-sm text-blue-300 hover:underline cursor-pointer"
                        >
                          See more
                        </button>
                      </div>
                    )}
                  </div>
                )}


                {/* Expanded content + "See less" button */}
                {showPlayerInfo === player.id && (
                  <div className="mt-4 w-full text-sm text-gray-300 space-y-2">
                    <div><strong>Goals:</strong> {player.goals}</div>
                    <div><strong>Assists:</strong> {player.assists}</div>
                    <div><strong>Age:</strong> {player.age}</div>
                    <div><strong>Height:</strong> {player.height} cm</div>

                    <div className="mt-2 text-center">
                      <button
                        onClick={() => handleSeeMoreClick(player.id)}
                        className="text-sm text-blue-300 hover:underline cursor-pointer"
                      >
                        See less
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Player Form */}
              {showEditPlayerForm && selectedPlayer?.id === player.id && (
                <EditPlayerForm selectedPlayer={player} setShowEditPlayerForm={setShowEditPlayerForm} team={team} setTeam={setTeam} />
              )}
              </div>
            ))}
          </div>
        </div>
      </div>       
      )}
    </div>
  );
};

export default MyTeam;

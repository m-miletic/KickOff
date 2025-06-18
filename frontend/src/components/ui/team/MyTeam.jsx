import React, { useContext, useEffect, useState } from 'react';
import { LoggedUserContext } from '../../../context/LoggedUserContext';
import { getTeamByTeamRepresentative, updateTeamImage } from '../../../service/teamService';
import FileUpload from '../files/FileUpload';
import { addPlayer, deletePlayer, editPlayer } from '../../../service/playerService';
import defaultPlayerImg from '../../../assets/defaultPlayerImg.jpg';
import { MdOutlineModeEdit } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";

const MyTeam = () => {
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);
  const [team, setTeam] = useState("")
  const [error, setError] = useState("")

  const [selectedPlayer, setSelectedPlayer] = useState("")

  const [showEditPlayerForm, setShowEditPlayerForm] = useState(false)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showEditTeamForm, setShowEditTeamForm] = useState(false)

  const [selectedPlayerImage, setSelectedPlayerImage] = useState("");
  const [selectedTeamImage, setSelectedTeamImage] = useState("")

  const [previewPlayerImage, setPreviewPlayerImage] = useState(false) // pokazat sliku prije add player
  const [previewTeamImage, setPreviewTeamImage] = useState(false) 

  const [createPlayerErrors, setCreatePlayerErrors] = useState({})
  const [editPlayerErrors, setEditPlayerErrors] = useState({})


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await getTeamByTeamRepresentative(decodedJwt.userId)
        setTeam(response.data)
      } catch (error) {
        setError(error.message)
        console.log("this error: ", error)
      }
    };
    fetchTeam()
  }, [decodedJwt, jwt]);


  // ✅ team na prvi render je undefined 
  useEffect(() => {
    if (team?.id) {
      setAddPlayerForm((prev) => ({
        ...prev,
        teamId: team.id,
      }));
    }
  }, [team]);



  console.log("Team: ", team)

  const [editPlayerForm, setEditPlayerForm] = useState({
    goals: '',
    assists: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
  });

  const [addPlayerForm, setAddPlayerForm] = useState({
    goals: '',
    assists: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    teamId: team.id
  }); 

  const handleEditPlayerClick = (playerId) => {
    setShowPlayerInfo(false)
    setShowEditPlayerForm((prevPlayerId) => {
      if (prevPlayerId === playerId) {
        setSelectedPlayer("") // Clear selected if closing the form
        return false
      } else {
        setSelectedPlayer(playerId); // Set selected player ID here
        // Also update editPlayerForm with current player data
        const playerToEdit = team.players.find(p => p.id === playerId)
        if (playerToEdit) {
          setEditPlayerForm({
            ...playerToEdit
          });
        }
        return playerId;
      }
    });
  };

  const handleDeletePlayerClick = (playerId) => {
    setShowEditPlayerForm(false);
    setShowPlayerInfo(false)
  
    setShowDeleteConfirmation((prevId) =>
      prevId === playerId ? "" : playerId
    );
    setSelectedPlayer(playerId);
  };

  const confirmDeletePlayer = async (playerId) => {
    const response = await deletePlayer(playerId)
    const deletedPlayer = response.data
    setTeam((prevTeam) => ({
      ...prevTeam,
      players: prevTeam.players.filter(player => player.id !== deletedPlayer.id)
    }));
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

  const handleEditFormFieldChange = (e) => {
    setEditPlayerForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddFormFieldChange = (e) => {
    setAddPlayerForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };


  const validateEditPlayerForm = () => {
    const errors = {};
    const firstName = editPlayerForm.firstName.trim();
    const lastName = editPlayerForm.lastName.trim();
    const age = editPlayerForm.age;
    const height = editPlayerForm.height;
    const goals = editPlayerForm.goals;
    const assists = editPlayerForm.assists;

    if (!firstName) {
      errors.firstName = "First name is required.";
    } else if (firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters.";
    } else if (firstName.length > 15) {
      errors.firstName = "First name must be no more than 15 characters.";
    }

    if (!lastName) {
      errors.lastName = "Last name is required.";
    } else if (lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters.";
    } else if (lastName.length > 25) {
      errors.lastName = "Last name must be no more than 25 characters.";
    }

    if (!age) {
      errors.age = "Age is required.";
    } else if (age < 16) {
      errors.age = "Player can't be younger than 16 years";
    } else if (age > 50) {
      errors.age = "Player can't be older than 50";
    }
    
    if (height < 140 || height > 250) {
      errors.height = "Enter realistic height in centimeters";
    }

    if (goals < 0) {
      errors.goals = "Can't be a negative value";
    }

    if (assists < 0) {
      errors.assists = "Can't be a negative value";
    }

    return errors;
  }

  const handleEditPlayerFormSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateEditPlayerForm()

    if (Object.keys(formErrors).length > 0) {
      setEditPlayerErrors(formErrors)
      return
    } else {
      setEditPlayerErrors({})
    }
  
    try {
      const response = await editPlayer(editPlayerForm, selectedPlayer)
      const updatedPlayer = response.data
      setTeam((prevTeam) => ({
        ...prevTeam,
        players: prevTeam.players.map(player => player.id === selectedPlayer ? updatedPlayer : player)
      }));

      setShowEditPlayerForm(false)
      setSelectedPlayer("")
    } catch (error) {
      console.error("Error: ", error)
    }
  };

  /* Validacija Forme za kreiranje igrača */
  const validateCreatePlayerForm = () => {
    const errors = {};
    const firstName = addPlayerForm.firstName.trim();
    const lastName = addPlayerForm.lastName.trim();
    const age = addPlayerForm.age;
    const height = addPlayerForm.height;

    if (!firstName) {
      errors.firstName = "First name is required.";
    } else if (firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters.";
    } else if (firstName.length > 15) {
      errors.firstName = "First name must be no more than 15 characters.";
    }

    if (!lastName) {
      errors.lastName = "Last name is required.";
    } else if (lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters.";
    } else if (lastName.length > 25) {
      errors.lastName = "Last name must be no more than 25 characters.";
    }

    if (!age) {
      errors.age = "Age is required.";
    } else if (age < 16) {
      errors.age = "Player can't be younger than 16 years";
    } else if (age > 50) {
      errors.age = "Player can't be older than 50";
    }
    
    if (height < 140 || height > 250) {
      errors.height = "Enter realistic height in centimeters";
    }

    return errors;
  };

  const handleAddPlayerFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateCreatePlayerForm()

    if (Object.keys(formErrors).length > 0) {
      setCreatePlayerErrors(formErrors)
      return
    } else {
      setCreatePlayerErrors({})
    }
  
    try {
      let imageUrl = "";
  
      if (selectedPlayerImage) {
        const data = new FormData();
        data.append("file", selectedPlayerImage);
        data.append("upload_preset", "app_images");
        data.append("cloud_name", "dcjkglnuw");
  
        const res = await fetch("https://api.cloudinary.com/v1_1/dcjkglnuw/image/upload", {
          method: "POST",
          body: data,
        });
  
        const uploadResult = await res.json();
        imageUrl = uploadResult.url;
      }
  
      const newPlayerData = {
        ...addPlayerForm,
        photoUrl: imageUrl,
      };
  
      const response = await addPlayer(newPlayerData);
  
      if (response.success) {
        alert("Player Created!");
        setPreviewPlayerImage('');
        setSelectedPlayerImage('');
      }
  
      const newPlayer = response.data;
  
      setTeam((prevTeam) => ({
        ...prevTeam,
        players: [...prevTeam.players, newPlayer],
      }));
  
      setAddPlayerForm((prevValues) =>
        Object.fromEntries(Object.keys(prevValues).map((key) => [key, '']))
      );
    } catch (error) {
      console.error("Error adding player:", error);
    }
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
        alert("Team image updated!");
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

  const handleCancelEditPlayerClick = () => {
    setEditPlayerForm({
      goals: '',
      assists: '',
      firstName: '',
      lastName: '',
      age: '',
      height: '',
    });

    setEditPlayerErrors({})
    setShowEditPlayerForm(false)
  };


  if (error) {
    return <div>Error loading team: {error.message}</div>;
  }

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
            <form onSubmit={handleAddPlayerFormSubmit} className='text-white m-8'>
              <div className="flex space-x-12">
                {/* Left column for inputs */}
                <div className="space-y-4">
                  <div>
                    <label className='inline-block w-24'>First Name</label>
                    <input
                      type='text'
                      name='firstName'
                      value={addPlayerForm.firstName}
                      onChange={handleAddFormFieldChange}
                      className={`w-52 px-2 py-1 rounded border border-gray-500 text-sm text-black ${createPlayerErrors?.firstName ? "border-red-500" : ""}`}
                      placeholder="enter first name"
                    />
                    {createPlayerErrors?.firstName && (
                      <p className="text-red-500 text-xs mt-1 ml-[6rem]">
                        {createPlayerErrors?.firstName} 
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='inline-block w-24'>Last Name</label>
                    <input
                      type='text'
                      name='lastName'
                      value={addPlayerForm.lastName}
                      onChange={handleAddFormFieldChange}
                      className="w-52 px-2 py-1 rounded border border-gray-500 text-sm text-black"
                      placeholder="enter last name"
                    />
                    {createPlayerErrors?.lastName && (
                      <p className="text-red-500 text-xs mt-1 ml-[6rem]">
                        {createPlayerErrors?.lastName} 
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='inline-block w-24'>Age</label>
                    <input
                      type='number'
                      name='age'
                      value={addPlayerForm.age}
                      onChange={handleAddFormFieldChange}
                      className="w-52 px-2 py-1 rounded border border-gray-500 text-sm text-black"
                      placeholder="enter players age"
                    />
                    {createPlayerErrors?.age && (
                      <p className="text-red-500 text-xs mt-1 ml-[6rem]">
                        {createPlayerErrors?.age} 
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='inline-block w-24'>Height</label>
                    <input
                      type='number'
                      name='height'
                      value={addPlayerForm.height}
                      onChange={handleAddFormFieldChange}
                      className="w-52 px-2 py-1 rounded border border-gray-500 text-sm text-black"
                      placeholder="enter players height"
                    />
                    {createPlayerErrors?.height && (
                      <p className="text-red-500 text-xs mt-1 ml-[6rem]">
                        {createPlayerErrors?.height} 
                      </p>
                    )}
                  </div>


                  <div>
                    <button
                      type='submit'
                      className='px-3 py-1 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition'
                    >
                      Add
                    </button>
                  </div>
                </div>


                {/* Right column for photo upload */}
                <div className="space-y-4 mt-10 pl-44">
                  <div className='pl-3'>
                  <FileUpload
                    buttonStyle={"bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 -ml-8 rounded cursor-pointer inline-block"}
                    previewUrl={previewPlayerImage}
                    setPreviewUrl={setPreviewPlayerImage}
                    setSelectedFile={setSelectedPlayerImage}
                    label='Choose Player Image'
                  />
                  </div>
                </div>
              </div>
            </form>

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
              {showDeleteConfirmation === player.id ? (
                <div className="flex flex-col items-center w-full space-y-2 h-[200px] justify-center">
                  <span className="text-white font-medium">Delete player?</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => confirmDeletePlayer(player.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirmation("")}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
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
                {showEditPlayerForm === player.id && (
                  <div>
                    <form onSubmit={handleEditPlayerFormSubmit}>

                      <div>
                        <label>Goals</label>
                        <input
                          type='number'
                          name='goals'
                          value={editPlayerForm.goals}
                          onChange={handleEditFormFieldChange}
                          className="w-full px-2 py-1 rounded border border-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-black"
                        />
                        {editPlayerErrors?.goals && (
                          <p className="text-red-500 text-xs mt-1 py-1">
                            {editPlayerErrors?.goals} 
                          </p>
                        )}
                        
                      </div>

                      <div>
                        <label>Assists</label>
                        <input
                          type='number'
                          name='assists'
                          value={editPlayerForm.assists}
                          onChange={handleEditFormFieldChange}
                          className="w-full px-2 py-1 rounded border border-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-black"
                        />
                        {editPlayerErrors?.assists && (
                          <p className="text-red-500 text-xs mt-1 py-1">
                            {editPlayerErrors?.assists} 
                          </p>
                        )}
                      </div>

                      <div>
                        <label>First Name</label>
                        <input
                          type='text'
                          name='firstName'
                          value={editPlayerForm.firstName}
                          onChange={handleEditFormFieldChange}
                          className="w-full px-2 py-1 rounded border border-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-black"
                        />
                        {editPlayerErrors?.firstName && (
                          <p className="text-red-500 text-xs mt-1 py-1">
                            {editPlayerErrors?.firstName} 
                          </p>
                        )}
                      </div>

                      <div>
                        <label>Last Name</label>
                        <input
                          type='text'
                          name='lastName'
                          value={editPlayerForm.lastName}
                          onChange={handleEditFormFieldChange}
                          className="w-full px-2 py-1 rounded border border-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-black"
                        />
                        {editPlayerErrors?.lastName && (
                          <p className="text-red-500 text-xs mt-1 py-1">
                            {editPlayerErrors?.lastName} 
                          </p>
                        )}
                      </div>

                      <div>
                        <label>Age</label>
                        <input
                          type='number'
                          name='age'
                          value={editPlayerForm.age}
                          onChange={handleEditFormFieldChange}
                          className="w-full px-2 py-1 rounded border border-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-black"
                        />
                        {editPlayerErrors?.age && (
                          <p className="text-red-500 text-xs mt-1 py-1">
                            {editPlayerErrors?.age} 
                          </p>
                        )}
                      </div>

                      <div>
                        <label>Height</label>
                        <input
                          type='number'
                          name='height'
                          value={editPlayerForm.height}
                          onChange={handleEditFormFieldChange}
                          className="w-full px-2 py-1 rounded border border-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-black"
                        />
                        {editPlayerErrors?.height && (
                          <p className="text-red-500 text-xs mt-1 py-1">
                            {editPlayerErrors?.height} 
                          </p>
                        )}
                      </div>

                      <div>
                        <label>Player Image</label>
                        <div className='mt-1'>
                        <FileUpload
                          buttonStyle={"px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition"}
                          previewUrl={previewPlayerImage}
                          setPreviewUrl={setPreviewPlayerImage}
                          setSelectedFile={setSelectedPlayerImage}
                        />

                        </div>
                        
                      </div>
                      <div>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition mt-8"  type='submit'>Submit</button>
                        <button onClick={handleCancelEditPlayerClick} className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition ml-3'>Cancel</button>
                      </div>
                    </form>
                  </div>
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

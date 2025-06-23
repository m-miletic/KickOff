import React, { useEffect, useState } from "react";
import { editPlayer } from "../../../service/playerService";
import FileUpload from "../files/FileUpload";
import { toast } from "react-toastify";

const EditPlayerForm = ({ selectedPlayer, setShowEditPlayerForm, team, setTeam }) => {

  console.log("Selected Played: ", selectedPlayer)

  const [editPlayerErrors, setEditPlayerErrors] = useState({})
  const [selectedPlayerImage, setSelectedPlayerImage] = useState("")
  const [previewPlayerImage, setPreviewPlayerImage] = useState(false)

  const [editPlayerForm, setEditPlayerForm] = useState({
    goals: '',
    assists: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    teamId: team.id
  });

  useEffect(() => {
    if (selectedPlayer) {
      setEditPlayerForm({
        goals: selectedPlayer.goals || '',
        assists: selectedPlayer.assists || '',
        firstName: selectedPlayer.firstName || '',
        lastName: selectedPlayer.lastName || '',
        age: selectedPlayer.age || '',
        height: selectedPlayer.height || '',
        teamId: team.id,
      });
    }
  }, [selectedPlayer]);
  


  const handleEditPlayerFormSubmit = async (e) => {
    e.preventDefault()

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
        ...editPlayerForm,
        photoUrl: imageUrl || selectedPlayer.photoUrl, // keep old image if not updated
        id: selectedPlayer.id,  // include player id for backend update
      };

      const response = await editPlayer(newPlayerData, selectedPlayer.id)

      if (response.success) {
        toast.success("Player Updated!", {
          autoClose: 2500
        });
        setPreviewPlayerImage('');
        setSelectedPlayerImage('');
      }
  
      const updatedPlayer = response.data;
  
      setTeam((prevTeam) => ({
        ...prevTeam,
        players: prevTeam.players.map((player) =>
          player.id === updatedPlayer.id ? updatedPlayer : player
        ),
      }));
      

    } catch (error) {
      if (error && error.data) {
        setEditPlayerErrors(error.data)
      } else {
        console.error("Unexpected error adding player:", error);
      }
    }
  };

  
  const handleEditFormFieldChange = (e) => {
    setEditPlayerForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
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


  return(
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
  );

}
export default EditPlayerForm;
import React, { useState } from "react";
import { addPlayer } from "../../../service/playerService";
import { toast } from "react-toastify";
import FileUpload from "../files/FileUpload";

const AddPlayerForm = ({ team, setTeam }) => {
  const [selectedPlayerImage, setSelectedPlayerImage] = useState("")
  const [previewPlayerImage, setPreviewPlayerImage] = useState(false)
  const [createPlayerErrors, setCreatePlayerErrors] = useState({})

  const [addPlayerForm, setAddPlayerForm] = useState({
    goals: '',
    assists: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    teamId: team.id
  }); 


  const handleAddFormFieldChange = (e) => {
    setAddPlayerForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };


  const handleAddPlayerFormSubmit = async (e) => {
    e.preventDefault();
  
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
        toast.success("Player Created!", {
          autoClose: 2500
        });
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
      if (error && error.data) {
        setCreatePlayerErrors(error.data)
      } else {
        console.error("Unexpected error adding player:", errorData);
      }
    }
  };

  return(
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
  );
}
export default AddPlayerForm;
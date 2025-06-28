import React, { useState } from "react";
import { createTeam } from "../../../../service/teamService";
import FileUpload from "../../files/FileUpload";
import { toast } from "react-toastify";

const CreateTeamForm = ({ setIsModalOpen, selectedRequest, setRequests, decodedJwt  }) => {

  const [formData, setFormData] = useState({
    teamName: '',
    coach: '',
    requestId: selectedRequest.id,
    representativeId: decodedJwt.userId,
    photoUrl: ''
  });

  const [errorMessage, setErrorMessage] = useState('');


  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const [previewTeamImage, setPreviewTeamImage] = useState(false) 
  const [selectedTeamImage, setSelectedTeamImage] = useState("")

  const handleCreateTeam = async (e) => {
    e.preventDefault()

    try {
      console.log("Entered try block")
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

      console.log("ImageUrl: ", imageUrl)

      const fullFormData = {
        ...formData,
        photoUrl: imageUrl
      }


      const response = await createTeam(fullFormData)

      if (response.success) {
        setIsModalOpen(false)
        toast.success("Team Created!",
          {
            autoClose: 2500
          }
        )
        setPreviewTeamImage('')
        setSelectedTeamImage('')
      } else {
        console.error("Failed to create team");
      }
    } catch (error) {
      setErrorMessage(error.data.message)
    }
  }

  return (
    <div className='text-black w-[400px]'>

      <form onSubmit={handleCreateTeam}>
  
        <div className="flex items-center p-4 space-x-1">
          <div className="w-24">
            <span className="text-sm">Team Name</span>
          </div>
          <div>
            <input
              type="text"
              name="teamName"
              className="text-xs w-64 h-8 px-2 py-1 border border-gray-300 rounded"
              onChange={handleInputChange}  
              placeholder="enter team name"
            />
          </div>
        </div>
        <div className='flex'>
          <div className='w-32'></div>
          <div className="text-red-500 text-xs mt-1">
            {errorMessage} 
          </div>
        </div>

        <div className="flex items-center p-4 space-x-1">
          <div className="w-24">
            <span className="text-sm">Team Image</span>
          </div>
          <div className='pl-3'>
            <FileUpload
              buttonStyle={"px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition"}
              previewUrl={previewTeamImage}
              setPreviewUrl={setPreviewTeamImage}
              setSelectedFile={setSelectedTeamImage}
              label='Choose Team Image'
            />
          </div>
        </div>

        <div className="flex justify-start ml-7 mt-2 pt-4 pb-2">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 transition px-6 py-2 rounded-md text-sm text-white shadow-sm"
          >
            Create
          </button>
        </div>

      </form>


  
{/*       {errorMessage && (
        <div className="text-red-600 text-sm px-4 pt-2">{errorMessage}</div>
      )} */}
  

  
    </div>
  );
  
}
export default CreateTeamForm;
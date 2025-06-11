import { Axios } from "axios";
import React, { useState } from "react";
import { uploadTeamCrest } from "../../../service/teamService";

const FileUpload = ({ teamId }) => {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if(!file) return
    setLoading(true)

    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "app_images")
    data.append("cloud_name", "dcjkglnuw")


    const response = await fetch("https://api.cloudinary.com/v1_1/dcjkglnuw/image/upload", {
      method: "POST",
      body: data
    })

    const uploadedImageUrl = await response.json()
    const uploadImageObj = {
      teamId: teamId,
      teamCrest: uploadedImageUrl.url
    }
    await uploadTeamCrest(uploadImageObj)
    setLoading(false)
    window.location.reload()

  };

  return (
    <div>
      <div>{loading ? "Uploading..." : ""}</div>  

      <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer inline-block">
        Upload File
        <input
          type="file"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

    </div>
  );
  
}
export default FileUpload;
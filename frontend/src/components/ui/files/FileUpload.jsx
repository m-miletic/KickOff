// FileUpload.js
import { useState } from "react";

const FileUpload = ({ label = "Add Image", buttonStyle, previewUrl, setPreviewUrl, setSelectedFile }) => {
  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  return (
    <div>
      {previewUrl && (
        <div className="mb-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-36 h-36 object-cover rounded-md border border-gray-400"
          />
        </div>
      )}

      <label className={buttonStyle}>
        {label}
        <input type="file" className="hidden" onChange={handleImageSelection} />
      </label>
    </div>
  );
};

export default FileUpload;

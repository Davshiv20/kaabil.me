import React, { useRef } from "react";

function ImageUploader({ onSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onSelect(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
}

export default ImageUploader;

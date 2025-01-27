import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const addDocument = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      console.log("Uploaded file:", acceptedFiles[0]); // You can handle the file upload here.
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    noClick: true, // Prevent automatic opening on click
    noKeyboard: true, // Prevent automatic opening with keyboard
  });

  return (
    <div className="p-4 border border-gray-300 rounded-lg w-96 mx-auto">
      <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 border-gray-400 rounded-md p-4 text-center",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag and drop your .doc or .docx file here, or</p>
        <button
          type="button"
          onClick={open}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Browse File
        </button>
      </div>
      {uploadedFile && (
        <div className="mt-4">
          <h4 className="font-semibold">Uploaded File:</h4>
          <p>{uploadedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default addDocument;

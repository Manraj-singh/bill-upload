import React, { useState } from "react";
import FileUpload from "./components/file-upload/file-upload.component";
import { handleFileUpload } from "./utils/fileUpload";

function App() {
  const [bills, setBills] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);

  const updateUploadedFiles = (files) => setBills(files);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUploadStatus("upload started");
    setError(null);

    for (let file of bills) {
      const res = await handleFileUpload(file);
      if (res.status === "success") {
        console.log(res.status);
        setUploadStatus("success");
        setError(null);
      } else {
        setUploadStatus("Error occured ");
        setError(res.error);
        setUploadStatus(null);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          accept=".pdf"
          multiple
          setUploadStatus={setUploadStatus}
          updateFilesCb={updateUploadedFiles}
        />
        {uploadStatus && <h2>Status: {uploadStatus}</h2>}
        {error && <h2> {error}</h2>}
        <button type="submit">Upload files</button>
      </form>
    </div>
  );
}

export default App;

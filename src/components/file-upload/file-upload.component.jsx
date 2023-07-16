import React, { useRef, useState } from "react";
import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel,
} from "./file-upload.style";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const FileUpload = ({
  updateFilesCb,
  setUploadStatus,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    setUploadStatus(null);
    const { files: newFiles } = e.target;

    if (newFiles.length) {
      if (!(newFiles[0].type === "application/pdf")) {
        console.log("here");
        alert("only PDF files are allowed");
        return;
      }
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };

  return (
    <>
      <FileUploadContainer>
        <DragDropText>Drag and drop your files anywhere or</DragDropText>
        <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
          <span> Upload {otherProps.multiple ? "files" : "a file"}</span>
        </UploadFileBtn>
        <FormField
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </FileUploadContainer>
      <FilePreviewContainer>
        <span>To Upload</span>
        <PreviewList>
          {Object.keys(files).map((fileName, index) => {
            let file = files[fileName];

            return (
              <PreviewContainer key={fileName}>
                <div>
                  <ImagePreview
                    src={URL.createObjectURL(file)}
                    alt={`file preview ${index}`}
                  />

                  <FileMetaData>
                    <span>{file.name}</span>
                    <aside>
                      <span>{convertBytesToKB(file.size)} kb</span>
                      <RemoveFileIcon onClick={() => removeFile(fileName)}>
                        Delete
                      </RemoveFileIcon>
                    </aside>
                  </FileMetaData>
                </div>
              </PreviewContainer>
            );
          })}
        </PreviewList>
      </FilePreviewContainer>
    </>
  );
};

export default FileUpload;

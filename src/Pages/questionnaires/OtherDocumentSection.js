import { FormHelperText, TextField,Tooltip ,FormControl,Button} from '@mui/material';
import React, { useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import DialogBox from '../../components/DialogBox';
// import { Button } from '@mui/base';
import { privateAxios } from '../../api/axios';
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { DELETE_OTHER_DOCS, UPLOAD_OTHER_DOC } from '../../api/Url';

function OtherDocumentSection({
    setQuestionnaire,questionnaire,sectionIndex,documents,err
}) {
  const allowdedFiles = [
    ".jpg",
    ".jpeg",
    ".png",
    ".doc",
    ".txt",
    ".pdf",
    ".docx",
    ".xlsx",
    ".xls",
    ".ppt",
    ".pptx",
    ".mp4",
    ".mp3",
    ".zip",
    ".rar",
  ];
    const [fileUploadDailog, setFileUploadDailog] = useState(false)
    const [file, setFile] = useState(null)
    let formData = new FormData()
    const [documentIndexforFIle, setDocumentIndexforFIle] = useState('')
    console.log("questionnaire in other doc=",questionnaire)
      //method to handle question change handler
      const onQuestionChangeHandler = (event, docIndex) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].documents[docIndex][name] =
            value;
        setQuestionnaire(tempQuestionnaire);
    };
    //method to handle question blur event
    const onQuestionBlurHandler = (event, docIndex) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].documents[docIndex][name] =
            value?.trim();
        setQuestionnaire(tempQuestionnaire);
    };

     //On + icon click new question will get added
     const addQuestionHandler = () => {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].documents.push({
            
                uuid:uuidv4(),
                documentTitle:'',
                originalName:''
              
        });
        setQuestionnaire(tempQuestionnaire);
    };
    const deleteDocumenthandler=async(uuid)=>{
      console.log('questionnaire id = ',questionnaire?.uuid)
      try {
        const response = await privateAxios.delete(DELETE_OTHER_DOCS,{data:{questionnaireId:questionnaire.uuid,documentId:uuid}})
        console.log("document deleted",response)
      } catch (error) {
        console.log("Error from delete uploaded other doc",error)
      }
      let tempQuestionnaire = { ...questionnaire };
      let tempQuestions = tempQuestionnaire?.sections[
          sectionIndex
      ]?.documents.filter((document) => document.uuid !== uuid);
      tempQuestionnaire.sections[sectionIndex].documents = [...tempQuestions];
      setQuestionnaire(tempQuestionnaire);
    }
    let docs = questionnaire?.sections?.filter(section=>section.layout==='documents')
    console.log('docs = ',docs[0]?.documents.map(doc=>doc))
    console.log('section index', sectionIndex)
    const checkIfSameQuestionTitlePresent = (title) => {
        let filterSameNameQuestionTitle = questionnaire.sections[
            sectionIndex
        ].documents.filter((document) => document.documentTitle === title);
        if (filterSameNameQuestionTitle.length > 1) {
            
            return true;
        } else {
            return false;
        }
    };

    // file change handler
    const fileChangeHandler=(event)=>{
      console.log('file change hadler clicked',questionnaire)
      const file = event.target.files[0];

      // Check if a file is selected
      if (file) {
        // Check if the file type is allowed
        const fileExtension = `.${file.name.split(".").pop()}`;
        if (!allowdedFiles.includes(fileExtension.toLowerCase())) {
          alert("Invalid file type. Please select a valid file.");
          return;
        }
  
        // Check if the file size is within the limit (10 MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(
            "File size exceeds the limit of 10 MB. Please select a smaller file."
          );
          return;
        }
        setFile(event.target.files[0])
        // formData.append('document',event.target.files[0])
        console.log("inside if");
        
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].documents[documentIndexforFIle]['originalName'] =
            file.name;
        setQuestionnaire(tempQuestionnaire);
        //  setFilePreview(file.name);
        // setValue(fname, file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          // setFile(e?.target?.result);
        };
        // reader.readAsDataURL(file);
  
        // Set the selected file
        // setFile(file);
      }
    }
    // file upload
    const fileUpload=async()=>{
      console.log("file upload click",file)
      formData.append('questionnaireId',questionnaire?.uuid)
      formData.append('sectionId',questionnaire.sections[sectionIndex].uuid)
      formData.append('documentId',questionnaire.sections[sectionIndex].documents[documentIndexforFIle].uuid)
      formData.append('documentTitle',questionnaire.sections[sectionIndex].documents[documentIndexforFIle].documentTitle)
      formData.append('document',file)
        try {
            const response = await privateAxios.post(UPLOAD_OTHER_DOC,formData,{headers:{"Content-Type": "multipart/form-data"}}) 
            if (response.status===201) {
            window.alert('response',response)
            formData.append('questionnaireId',questionnaire?.uuid)
            formData.append('sectionId',questionnaire.sections[sectionIndex].uuid)
            formData.delete('document')
            formData.delete('documentTitle')
            formData.delete('documentId')
            setFile('')
              setFileUploadDailog(false)
              setDocumentIndexforFIle('')
            }
        } catch (error) {
            console.log("error from file ")
        }
    }
    console.log('error from other doc',err)
  return (
    <>
    <DialogBox
        title={<p>Upload other documents</p>}
        info1={" "}
        info2={
          (
            <div className="upload-file-wrap">
              <Button
                variant="contained"
                component="label"
                className="upload-file-btn"
              >
                <div
                  className={
                  "upload-file-blk"
                  }
                >
                  {/* <input hidden accept="image/*" multiple type="file" /> */}
                  <input
                    // ref={fileRef}
                    type={"file"}
                    hidden
                    accept={
                      ".jpg, .jpeg, .png, .doc, .txt, .pdf, .docx, .xlsx, .xls, .ppt, .pptx, .mp4, .mp3, .zip, .rar"
                    }
                    name="files[]"
                    // value={file}
                    onChange={fileChangeHandler}
                    // multiple
                  />
                  <span className="upload-icon">
                    <CloudUploadOutlinedIcon />
                  </span>
                  <span className="file-upload-txt">
                    Click here to choose files (max file size{" "}
                    {`${process.env.REACT_APP_MAX_FILE_SIZE_MB} MB`})
                  </span>
                </div>
              </Button>
              <p
                style={{
                  color: "#f7a823",
                  fontFamily: "ProximaNova-Semibold, serif, sans-serif",
                  margin: "10px 0px",
                }}
              >
                Uploading large files may take some time
              </p>
              {questionnaire?.sections[sectionIndex]?.documents?.[documentIndexforFIle]?.['originalName']}

              {/* </p> */}
            </div>
          )
        }
        primaryButtonText={"Save"}
        secondaryButtonText={"Cancel"}
        onPrimaryModalButtonClickHandler={fileUpload}
        isDisabledPrimaryButton={false}
        onSecondaryModalButtonClickHandler={()=>setFileUploadDailog(false)}
        openModal={fileUploadDailog}
        setOpenModal={setFileUploadDailog}
        isModalForm={true}
        handleCloseRedirect={()=>setFileUploadDailog(false)}
      />
    
    <div className="que-form-card-wrapper">
    <div className="drag-drop-box"></div>
    {/* <div className="que-form-blk"> */}
    {
    docs[0]?.documents.map((document,docIndex)=> {return(
        <div
        className={`que-card-blk 
        ${docIndex + 1 === docs[0].documents.length && "active"}
        `}
        key={document?.uuid}
    >
        <div className="que-form-blk">
            <div className="que-card-innerblk flex-between">
                <div className="que-card-form-leftfield">
                    <div className="form-group">
                        <label htmlFor="questionTitle">
                            Other Document Title{" "}{docIndex+1}
                            <span className="mandatory">*</span>
                        </label>
                        <TextField
                            className={`input-field ${
                                (!document?.documentTitle &&
                                    err?.documentTitle &&
                                    "input-error") ||
                                (checkIfSameQuestionTitlePresent(
                                    document?.documentTitle
                                ) &&
                                    err?.documentTitle &&
                                    "input-error")
                            } `}
                            placeholder="Enter document title"
                            name="documentTitle"
                            value={document?.documentTitle}
                            helperText={
                                !document?.documentTitle &&
                                    err?.documentTitle ?"Enter document title":
                                    checkIfSameQuestionTitlePresent(
                                        document?.documentTitle
                                    ) &&
                                        err?.documentTitle
                                    ?"Title already in use":""
                            }
                            onChange={(e) =>
                                onQuestionChangeHandler(e, docIndex)
                            }
                            onBlur={(e) =>
                                onQuestionBlurHandler(e, docIndex)
                            }
                        />
                    </div>
                    
                </div>
                <div className="que-card-form-rightfield flex-between">
                <FormControl>
            <a
              href="#"
              onClick={() =>{ setFileUploadDailog(true);setDocumentIndexforFIle(docIndex)}}
              style={{
                color: "#f7a823",
                textDecoration: "none",
                pointerEvents: 'auto',
              }}
            >
              Upload other document
            </a>
            {questionnaire?.sections[sectionIndex]?.documents?.[docIndex]?.['originalName']}

            {/* // <input type="file" onChange={onAttachmetChangeHandler} multiple /> */}
            <FormHelperText>
             { !document?.originalName &&
                                    err?.originalName?"Upload document":" "}
            </FormHelperText>
          </FormControl>
                    </div>
                </div>
                </div>
                <div className="que-card-icon-sect">
                    <div className="que-card-icon-blk">
                        {docIndex === docs[0].documents?.length - 1 && (
                            <div className="que-card-icon add-que-iconblk mr-40">
                                <Tooltip title="Add document">
                                    <img
                                        onClick={addQuestionHandler}
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/add-question-icon.svg"
                                        }
                                        alt=""
                                    />
                                </Tooltip>
                            </div>
                        )}
                        { docs[0].documents?.length!== 1 && (
                            <div className="que-card-icon delete-iconblk mr-40">
                                <Tooltip title="Delete Question">
                                    <img
                                        onClick={() =>
                                            deleteDocumenthandler(
                                                document?.uuid,
                                            )
                                        }
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/delete-icon.svg"
                                        }
                                        alt=""
                                    />
                                </Tooltip>
                            </div>
                        )}
                        <div className="required-toggle-btnblk">
                          
                        </div>
                        </div>
                        
                        </div>
                        
                </div>



     )})
    }
    </div>
    </>
//    </div>
    // </div>
  )
}

export default OtherDocumentSection
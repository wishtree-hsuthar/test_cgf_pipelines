import { FormHelperText, TextField, Tooltip, FormControl, Button, Select, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import DialogBox from '../../components/DialogBox';
// import { Button } from '@mui/base';
import { privateAxios } from '../../api/axios';
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { DELETE_OTHER_DOCS, UPLOAD_OTHER_DOC } from '../../api/Url';
import { catchError } from '../../utils/CatchError';
import Toaster from '../../components/Toaster';
import useCallbackState from '../../utils/useCallBackState';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
const ITEM_HEIGHT = 42;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4,
    },
  },
};
function OtherDocumentSection({
  setQuestionnaire, questionnaire, sectionIndex, documents, err
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
  const navigate = useNavigate();
  const [otherDocsToasterDetails, setOtherDocsToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const otherDocToasterRef = useRef()
  const [documentIndexforFIle, setDocumentIndexforFIle] = useState('')
  console.log("questionnaire in other doc=", questionnaire)
  console.log("section index in other doc=", sectionIndex)

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

      uuid: uuidv4(),
      documentTitle: '',
      originalName: '',
      type: 'File'

    });
    setQuestionnaire(tempQuestionnaire);
  };
  const changeTypeHanlder = (e, docIndex) => {

    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].documents[docIndex].type = e.target.value;
    if (e.target.value === 'Link') {
      tempQuestionnaire.sections[sectionIndex].documents[docIndex] = {
        uuid: tempQuestionnaire.sections[sectionIndex].documents[docIndex].uuid,
        linkTitle: tempQuestionnaire.sections[sectionIndex].documents[docIndex].documentTitle,
        type: e.target.value,
        link: ''
      };

      setQuestionnaire(tempQuestionnaire);

    }
    setQuestionnaire(tempQuestionnaire);
  }
  const deleteDocumenthandler = async (uuid) => {
    console.log('questionnaire id = ', questionnaire?.uuid)
    try {
      const response = await privateAxios.delete(DELETE_OTHER_DOCS, { data: { questionnaireId: questionnaire.uuid, documentId: uuid } })
      console.log("document deleted", response)
    } catch (error) {
      console.log("Error from delete uploaded other doc", error)
    }
    let tempQuestionnaire = { ...questionnaire };
    let tempQuestions = tempQuestionnaire?.sections[
      sectionIndex
    ]?.documents.filter((document) => document.uuid !== uuid);
    tempQuestionnaire.sections[sectionIndex].documents = [...tempQuestions];
    setQuestionnaire(tempQuestionnaire);
  }
  let docs = questionnaire?.sections?.filter(section => section.layout === 'documents')
  console.log('docs = ', docs)
  console.log('section index', sectionIndex)
  const checkIfSameQuestionTitlePresent = (title, typeTitle) => {
    let filterSameNameQuestionTitle = questionnaire.sections[
      sectionIndex
    ].documents.filter((document) => document?.[typeTitle] === title);
    if (filterSameNameQuestionTitle.length > 1) {

      return true;
    } else {
      return false;
    }
  };

  // file change handler
  const fileChangeHandler = (event) => {
    console.log('file change hadler clicked', questionnaire)
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

      // let tempQuestionnaire = { ...questionnaire };
      // tempQuestionnaire.sections[sectionIndex].documents[documentIndexforFIle]['originalName'] =
      //   file.name;
      // setQuestionnaire(tempQuestionnaire);
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
  const fileUpload = async () => {
    if (questionnaire.sections[sectionIndex].documents[documentIndexforFIle].documentTitle==='') {
      setFileUploadDailog(false)
      setFile('')
      setOtherDocsToasterDetails(
        {
          titleMessage: "oops!",
          descriptionMessage: 'Please enter title first',
          messageType: "error",
        },
        () => otherDocToasterRef.current()
      )
        return;
    } else if (file===''||file===null) {
      setOtherDocsToasterDetails(
        {
          titleMessage: "oops!",
          descriptionMessage: 'Please upload document',
          messageType: "error",
        },
        () => otherDocToasterRef.current()
      )
    } else {
      
    
    formData.append('questionnaireId', questionnaire?.uuid)
    formData.append('sectionId', questionnaire.sections[sectionIndex].uuid)
    formData.append('documentId', questionnaire.sections[sectionIndex].documents[documentIndexforFIle].uuid)
    formData.append('documentTitle', questionnaire.sections[sectionIndex].documents[documentIndexforFIle].documentTitle)
    formData.append('document', file)
    try {
      const response = await privateAxios.post(UPLOAD_OTHER_DOC, formData, { headers: { "Content-Type": "multipart/form-data" } })
      if (response.status === 201) {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].documents[documentIndexforFIle]['originalName'] =
          file.name;
        setQuestionnaire(tempQuestionnaire);
        formData.append('questionnaireId', questionnaire?.uuid)
        formData.append('sectionId', questionnaire.sections[sectionIndex].uuid)
        formData.delete('document')
        formData.delete('documentTitle')
        formData.delete('documentId')
        setFile('')
        setFileUploadDailog(false)
        setDocumentIndexforFIle('')
        setOtherDocsToasterDetails(
          {
            titleMessage: "Hurray!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => otherDocToasterRef.current()
        )
      }

    } catch (error) {
      catchError(error, setOtherDocsToasterDetails, otherDocToasterRef, navigate)
      formData.delete('document')
      formData.delete('documentTitle')
      formData.delete('documentId')
      console.log("error from file ")
    }
  }
  }
  console.log('error from other doc', err)
  const classnameForTitle = (document, docIndex) => {
    if (questionnaire.sections[sectionIndex].documents[docIndex].type === 'Link') {
      return `input-field ${(!document?.linkTitle &&
        err?.linkTitle &&
        "input-error") ||
        (checkIfSameQuestionTitlePresent(
          document?.linkTitle, 'linkTitle'
        ) &&
          err?.linkTitle &&
          "input-error")
        } `
    } else {
      return `input-field ${(!document?.documentTitle &&
        err?.documentTitle &&
        "input-error") ||
        (checkIfSameQuestionTitlePresent(
          document?.documentTitle, 'documentTitle'
        ) &&
          err?.documentTitle &&
          "input-error")
        } `
    }
  }
  const helperTextForTitle = (document, docIndex) => {
    if (questionnaire.sections[sectionIndex].documents[docIndex].type === 'Link') {
      return !document?.linkTitle &&
        err?.linkTitle ? "Enter title" :
        checkIfSameQuestionTitlePresent(
          document?.linkTitle, 'linkTitle'
        ) &&
          err?.linkTitle
          ? "Title already in use" : ""
    } else {
      return !document?.documentTitle &&
        err?.documentTitle ? "Enter title" :
        checkIfSameQuestionTitlePresent(
          document?.documentTitle, 'documentTitle'
        ) &&
          err?.documentTitle
          ? "Title already in use" : ""
    }
  }
  return (
    <>
      <Toaster
        myRef={otherDocToasterRef}
        titleMessage={otherDocsToasterDetails.titleMessage}
        descriptionMessage={otherDocsToasterDetails.descriptionMessage}
        messageType={otherDocsToasterDetails.messageType}
      />
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
                    '.doc', '.txt', '.pdf','.docx', '.xls', '.ppt', '.pptx', '.xlsx', '.jpg', '.jpeg', '.png
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
              {file?.name??questionnaire?.sections[sectionIndex]?.documents?.[documentIndexforFIle]?.['originalName']}

              {/* </p> */}
            </div>
          )
        }
        primaryButtonText={"Save"}
        secondaryButtonText={"Cancel"}
        onPrimaryModalButtonClickHandler={fileUpload}
        isDisabledPrimaryButton={false}
        onSecondaryModalButtonClickHandler={() => {setFileUploadDailog(false);setFile(null)}}
        openModal={fileUploadDailog}
        setOpenModal={setFileUploadDailog}
        isModalForm={true}
        handleCloseRedirect={() => {setFileUploadDailog(false);setFile(null)}}
      />

      <div className="que-form-card-wrapper">
        <div className="drag-drop-box"></div>
        {/* <div className="que-form-blk"> */}
        {
          questionnaire.sections?.[sectionIndex].documents.map((document, docIndex) => {
            return (
              <div
                className={`que-card-blk 
        ${docIndex + 1 === questionnaire.sections?.[sectionIndex].documents.length && "active"}
        `}
                key={document?.uuid}
              >
                <div className="que-form-blk">
                  <div className="flex-between-other-section">
                    <div className="flex-between-other-section-left">
                     

                      <div className="form-group">
                        <label htmlFor="inputField">
                          Type <span className="mandatory">*</span>
                        </label>
                        <FormControl className="fullwidth-field">
                          <div className="select-field">
                            <Select
                              MenuProps={MenuProps}
                              placeholder="Select type"
                              IconComponent={(props) => (
                                <KeyboardArrowDownRoundedIcon
                                  {...props}
                                />
                              )}
                              name="inputType"
                              value={document?.type}
                              onChange={(e) =>
                                changeTypeHanlder(
                                  e,
                                  docIndex
                                )
                              }
                            // onChange={(e) => onQuestionChangeHandler(e, questionIdx)}
                            >
                              {
                                ['Link', 'File'].map((option) => (
                                  <MenuItem
                                    // key={option?._id}
                                    value={option}
                                  >
                                    {option}
                                  </MenuItem>
                                ))}
                            </Select>
                          </div>
                          <FormHelperText> </FormHelperText>
                        </FormControl>
                      </div>

                    </div>
                    {/* <div className="flex-between-other-section-right"> */}
                    <div className="flex-mid-other-section form-group">
                        <label htmlFor="questionTitle">
                          Title {" "}
                          <span className="mandatory">*</span>
                        </label>
                        <TextField
                          className={classnameForTitle(document, docIndex)}
                          placeholder="Enter title"
                          name={questionnaire.sections[sectionIndex].documents[docIndex].type === 'File' ? 'documentTitle' : "linkTitle"}
                          value={questionnaire.sections[sectionIndex].documents[docIndex].type === 'File' ? document?.documentTitle : document?.linkTitle}
                          helperText={
                            helperTextForTitle(document, docIndex)
                          }
                          onChange={(e) =>
                            onQuestionChangeHandler(e, docIndex)
                          }
                          onBlur={(e) =>
                            onQuestionBlurHandler(e, docIndex)
                          }
                        />
                      </div>
                      
                      {
                        questionnaire.sections[sectionIndex].documents[docIndex].type === 'File' ?
                        <div className="flex-end-other-section form-group">
                          <FormControl>
                            <a
                              href="#"
                              onClick={() => { setFileUploadDailog(true); setDocumentIndexforFIle(docIndex) }}
                              style={{
                                color: "#f7a823",
                                textDecoration: "none",
                                pointerEvents: 'auto',
                              }}
                            >
                              Upload Document
                            </a>
                            <p style={{
                              margin:"8px 0 auto"
                            }}>
                            {questionnaire?.sections[sectionIndex]?.documents?.[docIndex]?.['originalName']}
                           
                            </p>
                            <FormHelperText>
                            
                              {!document?.originalName &&
                                err?.originalName ? "Upload document" : " "}
                            </FormHelperText>
                          </FormControl>
                          </div>
                           :
                          <div className="flex-end-other-section form-group">
                            <label htmlFor="questionTitle">
                              Link {" "}
                              <span className="mandatory">*</span>
                            </label>
                            <TextField
                              className={`input-field ${(!document?.link &&
                                err?.link &&
                                "input-error") ||
                                (checkIfSameQuestionTitlePresent(
                                  document?.link
                                ) &&
                                  err?.link &&
                                  "input-error")
                                } `}
                              placeholder="Enter Link"
                              name="link"
                              value={document?.link}
                              helperText={
                                !document?.link &&
                                  err?.link ? "Enter Link" :
                                  checkIfSameQuestionTitlePresent(
                                    document?.link
                                  ) &&
                                    err?.link
                                    ? "Link already added" : ""
                              }
                              onChange={(e) =>
                                onQuestionChangeHandler(e, docIndex)
                              }
                              onBlur={(e) =>
                                onQuestionBlurHandler(e, docIndex)
                              }
                            />
                          </div>
                      }
                    
                    </div>

                    <div className="que-card-icon-sect">
                  <div className="que-card-icon-blk">

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

                    {docIndex === docs[0].documents?.length != 1 && (
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
                  </div>
                
               

              // </div>



            )
          })
        }
      </div>
    </>
    //    </div>
    // </div>
  )
}

export default OtherDocumentSection
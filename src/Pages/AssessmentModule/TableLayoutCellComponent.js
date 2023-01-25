import {
    TextField,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
    Button,
    Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
    DOWNlOAD_FILE,
    REACT_APP_FILE_ENCRYPT_SECRET,
    UPLOAD_ATTACHMENTS,
} from "../../api/Url";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
export const AlphaRegEx = /^[a-zA-Z ]*$/;
export const NumericRegEx = /^[0-9]+$/i;
export const AlphaNumRegEx = /^[a-z0-9]+$/i;

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
const TableLayoutCellComponent = ({
    isPrefilled,
    assessmentQuestionnaire,
    cell,
    columnId,
    sectionUUID,
    rowId,
    setAssessmentQuestionnaire,
    answer,
    transformedColumns,
    error,
    editMode,
    handleAnswersChange,
    handleAnswersBlur,
}) => {
    const [showMore, setShowMore] = useState(false);
    const [showMoreAttachment, setShowMoreAttachment] = useState(false);
    const myRef = React.useRef();

    const params = useParams();
    const [openFileAttachmenDialog, setOpenFileAttachmntDialog] =
        useState(false);
    const [isFileRemoved, setIsFileRemoved] = useState(false);
    const [oldfilesSelected, setOldfilesSelected] = useState([]);
    const [isDisabledPrimaryButton, setIsDisabledPrimaryButton] =
        useState(false);
    const handleOnKeyDownChange = (e) => {
        e.preventDefault();
    };
    const [isLoading, setIsLoading] = useState(false);
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

  const [currentSelectedFiles, setCurrentSelectedFiles] = useState([]);
  let columnUUID =
    isPrefilled ||
    (!isPrefilled &&
      assessmentQuestionnaire &&
      !Object.keys(assessmentQuestionnaire).length > 0)
      ? cell?.columnId
      : columnId;
  const getSingleFileAsUrl = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const result = e.target.result;
        // const encryptedFile = CryptoJS.AES.encrypt(
        //   result,
        //   REACT_APP_FILE_ENCRYPT_SECRET
        // ).toString();
        resolve(result);
      };
    });
  };
  const getFiles = async (files) => {
    let tempCurrentSelectedFiles = [...currentSelectedFiles];
    let isFileSizeExceed = 0;
    setIsLoading(true);
    for (const file of files) {
      const maxFileSize = process.env.REACT_APP_MAX_FILE_SIZE_MB * 1024 * 1024;
      if (file?.size > maxFileSize) {
        isFileSizeExceed += 1;
        continue;
      }
      const fileName = file?.name.split(".");
      const fileExtension = "." + fileName[fileName?.length - 1];
      console.log("fileExtension", fileExtension);
      if (!allowdedFiles.includes(fileExtension)) {
        isFileSizeExceed += 1;
        continue;
      }
      console.log("file:- ", file);
      const fileAsUrl = await getSingleFileAsUrl(file);
      tempCurrentSelectedFiles.push({
        file: fileAsUrl,
        type: file?.type,
        name: file?.name,
      });
      setCurrentSelectedFiles(tempCurrentSelectedFiles);
    }
    if (isFileSizeExceed) {
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage: `${isFileSizeExceed} ${isFileSizeExceed > 1 ? "files" : "file"} couldn't be uploaded`,
          messageType: "error",
        },
        () => myRef.current()
      );
    }
    setIsLoading(false);
  };
  const onAttachmetChangeHandler = async (e) => {
    let files = await e?.target?.files;
    getFiles(files);
  };
  const getFilesForBackend = () => {
    const filterdFiles = currentSelectedFiles.filter((file) => !file?.location);
    return filterdFiles;
  };
  const getFilesNotRemoved = () => {
    const filterdFiles = currentSelectedFiles.filter((file) => file?.location);
    return filterdFiles;
  };
  const uploadAttachmentButtonClickHandler = async () => {
    console.log("Current Selected files:- ", currentSelectedFiles);
    setIsDisabledPrimaryButton(true);
    try {
      const newlyAddedFiles = getFilesForBackend();
      const oldFiles = getFilesNotRemoved();
      const attachmentResponse = await privateAxios.post(UPLOAD_ATTACHMENTS, {
        assessmentId: params?.id,
        sectionId: sectionUUID,
        cellId: `${columnUUID}_${rowId}`,
        files: [...newlyAddedFiles],
      });
      setIsDisabledPrimaryButton(false);
      console.log("Attachment Response", attachmentResponse);
      let tempAssessment = { ...assessmentQuestionnaire };
      tempAssessment[sectionUUID][`${columnUUID}_${rowId}`] = [
        ...oldFiles,
        ...attachmentResponse?.data,
      ];
      console.log("Temp Assessment:- ", tempAssessment);
      setToasterDetails(
        {
          titleMessage: "",
          descriptionMessage: "Attachments saved!",
          messageType: "success",
        },
        () => myRef.current()
      );
      setAssessmentQuestionnaire(tempAssessment);
      setCurrentSelectedFiles([]);
      setOpenFileAttachmntDialog(false);
      setIsFileRemoved(false);
    } catch (error) {
      setIsDisabledPrimaryButton(false);
      if (error?.code === "ERR_CANCELED") return;
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something went wrong!",
          messageType: "error",
        },
        () => myRef.current()
      );
    }
  };
  const cancelAttachmentButtonClickHandler = () => {
    setCurrentSelectedFiles([]);
    setIsFileRemoved(false);
    setOpenFileAttachmntDialog(false);
  };
  // console.log("current selected files:- ", currentSelectedFiles);
  // console.log("Answer in first Render :- ", answer);
  const oldSelectedContainsCurrentSelectedFile = (file) => {
    let files = oldfilesSelected.filter(
        (dataFile) => file.location === dataFile.location
    );
    return files.length > 0 ? false : true;
};
useEffect(() => {
  if (
      answer &&
      answer?.length > 0 &&
      Array.isArray(answer) &&
      currentSelectedFiles?.length === 0 &&
      !isFileRemoved
  ) {
      // console.log("answer inside Use Effect:-", answer);
      setOldfilesSelected([...answer]);
  }
}, []);
  useEffect(() => {
    if (
      answer &&
      answer?.length > 0 &&
      Array.isArray(answer) &&
      currentSelectedFiles?.length === 0 &&
      !isFileRemoved
    ) {
      // console.log("answer inside Use Effect:-", answer);
      setCurrentSelectedFiles([...answer]);
    }
  }, [currentSelectedFiles]);
  // console.log("assessment Questionnaire",assessmentQuestionnaire)
  return (
    <>
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <DialogBox
        title={<p>Add Attachments</p>}
        info1={" "}
        info2={
          isLoading ? (
            <div className="loader-blk">
              <img src={Loader2} alt="Loading" />
            </div>
          ) : (
            <div className="upload-file-wrap">
              <Button
                variant="contained"
                component="label"
                className="upload-file-btn"
              >
                <div
                  className={
                    currentSelectedFiles?.length > 0
                      ? "upload-file-blk selected-file-blk"
                      : "upload-file-blk"
                  }
                >
                  {/* <input hidden accept="image/*" multiple type="file" /> */}
                  <input
                    type={"file"}
                    hidden
                    accept={
                      ".jpg, .jpeg, .png, .doc, .txt, .pdf, .docx, .xlsx, .xls, .ppt, .pptx, .mp4, .mp3, .zip, .rar"
                    }
                    // value={file}
                    onChange={onAttachmetChangeHandler}
                    multiple
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
              {currentSelectedFiles?.length > 0 && (
                <RenderCurrentFiles
                  currentSelectedFiles={currentSelectedFiles}
                  setCurrentSelectedFiles={setCurrentSelectedFiles}
                  setIsFileRemoved={setIsFileRemoved}
                />
              )}

                            {/* </p> */}
                        </div>
                    )
                }
                primaryButtonText={"Save"}
                secondaryButtonText={"Cancel"}
                onPrimaryModalButtonClickHandler={
                    uploadAttachmentButtonClickHandler
                }
                isDisabledPrimaryButton={isDisabledPrimaryButton}
                onSecondaryModalButtonClickHandler={
                    cancelAttachmentButtonClickHandler
                }
                openModal={openFileAttachmenDialog}
                setOpenModal={setOpenFileAttachmntDialog}
                isModalForm={true}
                handleCloseRedirect={cancelAttachmentButtonClickHandler}
            />
            {isPrefilled &&
                transformedColumns[columnUUID] &&
                transformedColumns[columnUUID].columnType === "prefilled" && (
                    <p className="text-justify">
                        {showMore ? (
                            <span>
                                <span>{cell?.value}</span>
                                <br />
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowMore(false);
                                    }}
                                    className="show-more-less-txt"
                                >
                                    Show Less
                                </a>
                            </span>
                        ) : (
                            <span>
                                {cell?.value.length > 100 ? (
                                    <span>
                                        <span>
                                            {cell?.value.slice(0, 100)}...
                                        </span>
                                        <br />
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowMore(true);
                                            }}
                                            className="show-more-less-txt"
                                        >
                                            Show More
                                        </a>
                                    </span>
                                ) : (
                                    cell?.value
                                )}
                            </span>
                        )}
                    </p>
                )}
            {transformedColumns[columnUUID] &&
                transformedColumns[columnUUID]?.columnType ===
                    "attachments" && (
                    <FormControl>
                        <a
                            href="#"
                            onClick={() => setOpenFileAttachmntDialog(true)}
                            style={{
                                color: "#f7a823",
                                textDecoration: "none",
                                pointerEvents: `${
                                    params["*"].includes("view") && "none"
                                }`,
                            }}
                        >
                            Add/Edit Attachments
                        </a>
                        {/* // <input type="file" onChange={onAttachmetChangeHandler} multiple /> */}
                        <FormHelperText>
                            {(!answer || answer?.length === 0) &&
                            error &&
                            error?.length !== 0
                                ? error
                                : ""}
                        </FormHelperText>
                    </FormControl>
                )}
            <span className="list-uploaded-file">
                {transformedColumns[columnUUID] &&
                    transformedColumns[columnUUID]?.columnType ===
                        "attachments" &&
                    answer &&
                    answer?.length > 0 &&
                    Array.isArray(answer) && (
                        <>
                            {answer.map((file, fileIdx) =>
                                file?.name?.length <= 30
                                    ? (fileIdx <= 1 || showMoreAttachment) && (
                                          <a
                                              key={fileIdx}
                                              href={
                                                  DOWNlOAD_FILE +
                                                      params.id +
                                                      "/attachments?id=" +
                                                      file?.location ?? "#"
                                              }
                                              style={{
                                                  textDecoration: "none",
                                                  display: "table",
                                                  color: `${
                                                          file.location
                                                          ?? "#1e1e1e"
                                                          
                                                  }`,

                                                  pointerEvents: `${
                                                          !file.location && "none"
                                                          
                                                  }`,
                                              }}
                                          >
                                              <>{`${file?.name}`}</>
                                          </a>
                                      )
                                    : (fileIdx <= 1 || showMoreAttachment) && (
                                          <Tooltip
                                              key={fileIdx}
                                              title={file?.name}
                                              style={{ textDecoration: "none" }}
                                              placement="bottom-start"
                                          >
                                              <a
                                                  href={
                                                          file.location?
                                                           DOWNlOAD_FILE +
                                                                params.id +
                                                                "/attachments?id=" +
                                                                file?.location :
                                                            "#"
                                                  }
                                                  style={{
                                                      display: "table",
                                                      textDecoration: "none",
                                                      color: `${
                                                       !file.location
                                                             && "#1e1e1e"
                                                              
                                                      }`,
                                                      cursor: `${
                                                              file.location
                                                              ? "pointer"
                                                              : "default"
                                                      }`,
                                                      //   pointerEvents: `${
                                                      //       oldSelectedContainsCurrentSelectedFile(
                                                      //           file
                                                      //       )
                                                      //           ? "none"
                                                      //           : ""
                                                      //   }`,
                                                  }}
                                              >
                                                  {`${file?.name?.slice(
                                                      0,
                                                      30
                                                  )}...`}
                                              </a>
                                          </Tooltip>
                                      )
                            )}
                            {showMoreAttachment ? (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        //   e.preventDefault();
                                        setShowMoreAttachment(false);
                                    }}
                                    className="show-more-less-txt"
                                    style={{
                                        marginTop: "5px",
                                        display: "inline-block",
                                    }}
                                >
                                    {answer?.length > 2 && "Show Less"}
                                </a>
                            ) : (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        // e.preventDefault();
                                        setShowMoreAttachment(true);
                                    }}
                                    className="show-more-less-txt"
                                    style={{
                                        marginTop: "5px",
                                        display: "inline-block",
                                    }}
                                >
                                    {answer?.length > 2 && "Show More"}
                                </a>
                            )}
                        </>
                    )}
            </span>
            {transformedColumns[columnUUID] &&
                transformedColumns[columnUUID].columnType === "textbox" && (
                    <TextField
                        className={`input-field ${
                            !answer && error && error?.length !== 0
                                ? "input-error"
                                : answer &&
                                  error &&
                                  transformedColumns[columnUUID]?.validation ===
                                      "alphabets" &&
                                  !AlphaRegEx.test(answer)
                                ? "input-error"
                                : answer &&
                                  error &&
                                  transformedColumns[columnUUID]?.validation ===
                                      "alphanumeric" &&
                                  !AlphaNumRegEx.test(answer)
                                ? "input-error"
                                : answer &&
                                  error &&
                                  transformedColumns[columnUUID]?.validation ===
                                      "numeric" &&
                                  !NumericRegEx.test(answer)
                                ? "input-error"
                                : ""
                        }`}
                        disabled={
                            (editMode && params["*"].includes("view")) ||
                            !editMode
                        }
                        placeholder="Enter text here"
                        value={answer}
                        name={`${columnUUID}_${rowId}`}
                        onChange={(e) =>
                            handleAnswersChange(e.target.name, e.target.value)
                        }
                        onBlur={(e) =>
                            handleAnswersBlur(e.target.name, e.target.value)
                        }
                        helperText={
                            !answer && error && error?.length !== 0
                                ? error
                                : answer &&
                                  transformedColumns[columnUUID]?.validation ===
                                      "alphabets" &&
                                  !AlphaRegEx.test(answer)
                                ? error
                                : answer &&
                                  transformedColumns[columnUUID]?.validation ===
                                      "numeric" &&
                                  !NumericRegEx.test(answer)
                                ? error
                                : answer &&
                                  transformedColumns[columnUUID]?.validation ===
                                      "alphanumeric" &&
                                  !AlphaNumRegEx.test(answer)
                                ? error
                                : " "
                        }
                    />
                )}
            {transformedColumns[columnUUID] &&
                transformedColumns[columnUUID].columnType === "dropdown" && (
                    <div className="select-field">
                        <FormControl className="fullwidth-field">
                            <Select
                                IconComponent={(props) => (
                                    <KeyboardArrowDownRoundedIcon {...props} />
                                )}
                                name={`${columnUUID}_${rowId}`}
                                displayEmpty
                                disabled={
                                    (editMode &&
                                        params["*"].includes("view")) ||
                                    !editMode
                                }
                                value={answer}
                                className={`${
                                    !answer && error && error?.length !== 0
                                        ? "select-field-error"
                                        : ""
                                }`}
                                onChange={(e) => {
                                    handleAnswersChange(
                                        e.target.name,
                                        e.target.value
                                    );
                                }}
                                renderValue={
                                    answer !== ""
                                        ? undefined
                                        : () => (
                                              <div className="select-placeholder">
                                                  Choose dropdown value
                                              </div>
                                          )
                                }
                            >
                                {/* <MenuItem value="" disabled>
                                    Select option
                                </MenuItem> */}
                                {transformedColumns[columnUUID].options.map(
                                    (option) => (
                                        <MenuItem key={option} value={option}>
                                            {option?.length <= 40 ? (
                                                option
                                            ) : (
                                                <Tooltip title={option}>
                                                    <span>
                                                        {option?.slice(0, 40) +
                                                            "..."}
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                            <FormHelperText>
                                {!answer && error && error?.length !== 0
                                    ? error
                                    : " "}
                            </FormHelperText>
                        </FormControl>
                    </div>
                )}
            {transformedColumns[columnUUID] &&
                transformedColumns[columnUUID].columnType === "date" && (
                    <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disabled={
                                    (editMode &&
                                        params["*"].includes("view")) ||
                                    !editMode
                                }
                                value={answer}
                                className={`datepicker-blk`}
                                components={{
                                    OpenPickerIcon: DateRangeOutlinedIcon,
                                }}
                                onChange={(dateValue) => {
                                    handleAnswersChange(
                                        `${columnUUID}_${rowId}`,
                                        new Date(
                                            new Date(dateValue)
                                        ).toLocaleDateString("en")
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        autoComplete="off"
                                        onKeyDown={handleOnKeyDownChange}
                                        className={`datepicker-blk input-field${
                                            !answer &&
                                            error &&
                                            error?.length !== 0
                                                ? "input-error"
                                                : ""
                                        }`}
                                    />
                                )}
                            />
                            <FormHelperText>
                                {!answer && error && error?.length !== 0
                                    ? error
                                    : " "}
                            </FormHelperText>
                        </LocalizationProvider>
                    </FormControl>
                )}
        </>
    );
};

export default TableLayoutCellComponent;

const RenderCurrentFiles = ({
    currentSelectedFiles,
    setCurrentSelectedFiles,
    setIsFileRemoved,
}) => {
    const onCurrentFileRemoveHandler = (fileIdx) => {
        let tempCurrentSelectedFiles = [...currentSelectedFiles];
        tempCurrentSelectedFiles.splice(fileIdx, 1);
        setCurrentSelectedFiles(tempCurrentSelectedFiles);
        setIsFileRemoved(true);
    };
    // console.log("current Selected Files:- ", currentSelectedFiles);
    return (
        <>
            {currentSelectedFiles.map((file, fileIdx) =>
                file?.name?.length <= 40 ? (
                    <p key={fileIdx} className="select-filename">
                        <a
                            href={file?.location ?? "#"}
                            // target="_blank"
                            style={{
                                textDecoration: "none",
                                color: `${!file?.location && "#1e1e1e"}`,
                                pointerEvents: `${!file?.location && "none"}`,
                            }}
                        >
                            {file?.name}
                        </a>
                        <span
                            className="file-close-icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => onCurrentFileRemoveHandler(fileIdx)}
                        >
                            {" "}
                            <CloseIcon />
                        </span>
                        {/* </div> */}
                    </p>
                ) : (
                    <Tooltip key={fileIdx} title={file?.name}>
                        <p className="select-filename">
                            <a
                                // target={"_blank"}
                                href={file?.location ?? "#"}
                                style={{
                                    textDecoration: "none",
                                    color: `${!file?.location && "#1e1e1e"}`,
                                    pointerEvents: `${
                                        !file?.location && "none"
                                    }`,
                                }}
                            >
                                {file?.name?.slice(0, 30) + "..."}
                            </a>
                            <span
                                className="file-close-icon"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    onCurrentFileRemoveHandler(fileIdx)
                                }
                            >
                                {" "}
                                <CloseIcon />
                            </span>
                            {/* </div> */}
                        </p>
                    </Tooltip>
                )
            )}
        </>
    );
};

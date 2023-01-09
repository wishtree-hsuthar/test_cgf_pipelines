import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { REACT_APP_FILE_ENCRYPT_SECRET, UPLOAD_ATTACHMENTS } from "../../api/Url";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
import { useRef } from "react";
export const AlphaRegEx = /^[a-zA-Z ]*$/;
export const NumericRegEx = /^[0-9]+$/i;
export const AlphaNumRegEx = /^[a-z0-9]+$/i;

const TableLayoutCellComponent = (props) => {
  const {
    isPrefilled,
    assessmentQuestionnaire,
    setAssessmentQuestionnaire,
    rowId,
    columnId = "",
    transformedColumns,
    cell,
    answer = "",
    handleAnswersChange,
    handleAnswersBlur,
    error,
    editMode,
    sectionUUID,
  } = props;
  const [showMore, setShowMore] = useState(false);
  const params = useParams();
  const [openFileAttachmenDialog, setOpenFileAttachmntDialog] = useState(false);
  const handleOnKeyDownChange = (e) => {
    e.preventDefault();
  };
  const [currentSelectedFiles, setCurrentSelectedFiles] = useState([]);
  let columnUUID =
    isPrefilled ||
    (!isPrefilled &&
      assessmentQuestionnaire &&
      !Object.keys(assessmentQuestionnaire).length > 0)
      ? cell?.columnId
      : columnId;
  // console.log("props:- ",props)
  // console.log("section UUID",sectionUUID)
  const getFileValuesArray = async (e) => {
    let files = e?.target?.files;
    console.log("fiels");

    let tempAssessment = { ...assessmentQuestionnaire };

    tempAssessment[sectionUUID][`${columnId}.${rowId}`] = [];
    let tempCurrentSelectedFiles = [...currentSelectedFiles];
    Object.keys(files).forEach(async (fileIdx) => {
      let reader = new FileReader();
      reader.readAsDataURL(files[fileIdx]);
      reader.onloadend = async () => {
        let result = reader.result;
        let encryptedFile = CryptoJS.AES.encrypt(
          result,
          REACT_APP_FILE_ENCRYPT_SECRET
        ).toString();
        tempCurrentSelectedFiles.push({
          file: encryptedFile,
          type: files[fileIdx]?.type,
          name: files[fileIdx]?.name,
        });
        setCurrentSelectedFiles(tempCurrentSelectedFiles);
      };
    });
    console.log("temp Current selected files", tempCurrentSelectedFiles);
  };
  const onAttachmetChangeHandler = async (e) => {
    console.log("calling on Change");
    console.log("files:- ", e.target.files);
    await getFileValuesArray(e);
    console.log("Assessment Questionnaire:- ", assessmentQuestionnaire);
    // console.log("filesArray:- ", filesArray);
  };
  const uploadAttachmentButtonClickHandler =async () => {
    console.log("Attachments:- ",currentSelectedFiles)
    const attachmentResponse = await privateAxios.post(UPLOAD_ATTACHMENTS,{files : [...currentSelectedFiles]})
    console.log("Attachment Response",attachmentResponse)
  };
  const cancelAttachmentButtonClickHandler = () => {
    setCurrentSelectedFiles([]);
    setOpenFileAttachmntDialog(false);
  };
  console.log("current selected files:- ", currentSelectedFiles);

  return (
    <>
      <DialogBox
        title={<p>Add Attachments</p>}
        info1={" "}
        info2={
          <div className="upload-file-wrap">
            <Button
              variant="contained"
              component="label"
              className="upload-file-btn"
            >
              <div className="upload-file-blk">
                {/* <input hidden accept="image/*" multiple type="file" /> */}
                <input
                  type={"file"}
                  hidden
                  // accept={".xls, .xlsx"}
                  // value={file}
                  onChange={onAttachmetChangeHandler}
                  multiple
                />
                <span className="upload-icon">
                  <CloudUploadOutlinedIcon />
                </span>
                <span className="file-upload-txt">
                  Click here to choose files
                </span>
              </div>
            </Button>

            {/* <p className="select-filename"> */}
            {answer && answer?.length > 0
              ? <span>Show Answer from Backend</span>
              : Object.keys(currentSelectedFiles)?.length > 0 && (
                  <RenderCurrentFiles
                    currentSelectedFiles={currentSelectedFiles}
                    setCurrentSelectedFiles={setCurrentSelectedFiles}
                  />
                )}
            {/* </p> */}
          </div>
        }
        primaryButtonText={"Upload"}
        secondaryButtonText={"Cancel"}
        onPrimaryModalButtonClickHandler={uploadAttachmentButtonClickHandler}
        onSecondaryModalButtonClickHandler={cancelAttachmentButtonClickHandler}
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
                    <span>{cell?.value.slice(0, 100)}...</span>
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
        transformedColumns[columnUUID]?.columnType === "attachments" && (
          <a
            href="#"
            onClick={() => setOpenFileAttachmntDialog(true)}
            style={{ color: "#4596D1" }}
          >
            Add Attachments
          </a>
          // <input type="file" onChange={onAttachmetChangeHandler} multiple />
        )}
      {transformedColumns[columnUUID] &&
        transformedColumns[columnUUID]?.columnType === "attachments" &&
        answer &&
        answer?.length > 0 &&
        answer.map((file, fileIdx) => <p key={fileIdx}>{`${file.name}`}</p>)}
      {transformedColumns[columnUUID] &&
        transformedColumns[columnUUID].columnType === "textbox" && (
          <TextField
            className={`input-field ${
              !answer && error && error?.length !== 0
                ? "input-error"
                : answer &&
                  error &&
                  transformedColumns[columnUUID]?.validation === "alphabets" &&
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
                  transformedColumns[columnUUID]?.validation === "numeric" &&
                  !NumericRegEx.test(answer)
                ? "input-error"
                : ""
            }`}
            disabled={(editMode && params["*"].includes("view")) || !editMode}
            placeholder="Enter text here"
            value={answer}
            name={`${columnUUID}.${rowId}`}
            onChange={(e) => handleAnswersChange(e.target.name, e.target.value)}
            onBlur={(e) => handleAnswersBlur(e.target.name, e.target.value)}
            helperText={
              !answer && error && error?.length !== 0
                ? error
                : answer &&
                  transformedColumns[columnUUID]?.validation === "alphabets" &&
                  !AlphaRegEx.test(answer)
                ? error
                : answer &&
                  transformedColumns[columnUUID]?.validation === "numeric" &&
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
                name={`${columnUUID}.${rowId}`}
                displayEmpty
                disabled={
                  (editMode && params["*"].includes("view")) || !editMode
                }
                value={answer}
                className={`${
                  !answer && error && error?.length !== 0
                    ? "select-field-error"
                    : ""
                }`}
                onChange={(e) => {
                  handleAnswersChange(e.target.name, e.target.value);
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
                {transformedColumns[columnUUID].options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {!answer && error && error?.length !== 0 ? error : " "}
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
                  (editMode && params["*"].includes("view")) || !editMode
                }
                value={answer}
                className={`datepicker-blk`}
                components={{
                  OpenPickerIcon: DateRangeOutlinedIcon,
                }}
                onChange={(dateValue) => {
                  handleAnswersChange(
                    `${columnUUID}.${rowId}`,
                    new Date(dateValue).toISOString()
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoComplete="off"
                    onKeyDown={handleOnKeyDownChange}
                    className={`input-field${
                      !answer && error && error?.length !== 0
                        ? "input-error"
                        : ""
                    }`}
                  />
                )}
              />
              <FormHelperText>
                {!answer && error && error?.length !== 0 ? error : " "}
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
}) => {
  const onCurrentFileRemoveHandler = (fileIdx) => {
    let tempCurrentSelectedFiles = [...currentSelectedFiles];
    tempCurrentSelectedFiles.splice(fileIdx, 1);
    setCurrentSelectedFiles(tempCurrentSelectedFiles);
  };
  return (
    <>
      {currentSelectedFiles.map((file, fileIdx) => (
        <p key={file?.name} className="select-filename">
          {file?.name}
          {console.log("inside condition")}
          {/* <div
            // className="que-input-type-close"
            // onClick={(e) => onOptionDeleteHandler(e, questionIdx, optionIdx)}
          > */}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => onCurrentFileRemoveHandler(fileIdx)}
          >
            {" "}
            <CloseIcon />
          </span>
          {/* </div> */}
        </p>
      ))}
    </>
  );
};

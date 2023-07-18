import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Logger } from "../../Logger/Logger";
import {
  ACCEPT_ASSESSMENT,
  ADD_QUESTIONNAIRE,
  DECLINE_ASSESSMENT,
  DOWNLOAD_ASSESSMENT_BY_ID,
  FETCH_ASSESSMENT_BY_ID,
  IMPORT_ASSESSMENT,
  REACT_APP_FILE_ENCRYPT_SECRET,
  SUBMIT_ASSESSMENT_AS_DRAFT,
} from "../../api/Url";
import { privateAxios } from "../../api/axios";
import DialogBox from "../../components/DialogBox";
import Toaster from "../../components/Toaster";
import { catchError } from "../../utils/CatchError";
import Loader from "../../utils/Loader";
import { downloadFunction, getTimeStamp } from "../../utils/downloadFunction";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import Charts from "./Charts/Charts";
const FillAssesmentSection = React.lazy(() =>
  import("./FillAssessmentSection")
);

export const AlphaRegEx = /^[a-zA-Z ]*$/;
export const NumericRegEx = /^[0-9]+$/i;
export const AlphaNumRegEx = /^[a-z0-9 ]+$/i;
const ITEM_HEIGHT = 42;
const CryptoJs = require("crypto-js");
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4,
    },
  },
};

const getTransformedColumns = (columns) => {
  let transformedColumns = {};
  columns.forEach((column) => {
    transformedColumns[column.uuid] = column;
  });
  return transformedColumns;
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const helperTextForReason = {
  comment: {
    required: "Enter the reason for rejecting assessment.",
    minLength: "Minimum 3 character required.",
  },
};

function FillAssessment() {
  //custom hook to set title of page
  useDocumentTitle("Fill Assessment");

  //state to hold chart images
  const [chartImages, setChartImages] = useState({});
  //   state to manage loaders
  const [isFillAssessmentLoading, setIsFillAssessmentLoading] = useState(false);
  const [file, setFile] = useState("");

  const { handleSubmit, control, setValue } = useForm({});
  const [value, setTabValue] = useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const params = useParams();
  const userAuth = useSelector((state) => state?.user?.userObj);

  const navigate = useNavigate();
  const [assessment, setAssessments] = useState({});
  const [questionnaire, setQuestionnaire] = useState({});
  const [assessmentQuestionnaire, setAssessmentQuestionnaire] = useState({});
  const [graphLevelBreakdown, setGraphLevelBreakdown] = useState(null);
  const [graphResult, setGraphResult] = useState(null);
  const [errorQuestion, setErrorQuestion] = useState("");
  const [errorQuestionUUID, setErrorQuestionUUID] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [disableFillAssessment, setDisableFillAssessment] = useState(false);
  const [disableImport, setDisableImport] = useState(true);
  const [saveAsDraftDependency, setSaveAsDraftDependency] = useState(false);
  const [errors, setErrors] = useState({});
  const [reOpenAssessmentDialogBox, setReOpenAssessmentDialogBox] =
    useState(false);
  const [invalidAssessmentDialogBox, setInvalidAssessmentDialogBox] =
    useState(false);
  const fileRef = useRef(null);

  const viewInstruction = () => {
    navigate("/assessment-list/instructions");
  };

  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  const handleSetErrors = (errors) => {
    setErrors({ ...errors });
  };

  const handleCatchError = (error, functionName) => {
    Logger.info(`Fill Assessment - handleCatchError handler ${functionName} `);
    catchError(error, setToasterDetails, myRef, navigate, "/assessment-list");
  };

  const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);

  const fetchQuestionnaire = async (
    id,
    graphResult,
    graphLevelBreakdown,
    isMounted,
    controller
  ) => {
    Logger.info("Fill Assessment - fetchQuestionnaire handler ");
    try {
      const response = await privateAxios.get(`${ADD_QUESTIONNAIRE}/${id}`, {
        signal: controller.signal,
      });
      isMounted && setQuestionnaire({ ...response.data });
      graphResult &&
        graphLevelBreakdown &&
        setTabValue(response?.data?.sections?.length);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.info(
        `Fill Assessment - fetchQuestionnaire handler catch error - ${error?.response?.data?.message}`
      );
      catchError(error, setToasterDetails, myRef, navigate);
    }
  };
  const fetchAssessments = async (isMounted, controller) => {
    Logger.info("Fill Assessment - fetchAssessments handler");
    try {
      setIsFillAssessmentLoading(true);
      const response = await privateAxios.get(
        `${FETCH_ASSESSMENT_BY_ID}${params.id}`,
        {
          signal: controller.signal,
        }
      );
      setIsFillAssessmentLoading(false);
      setEditMode(
        userAuth?._id === response?.data?.assignedOperationMember?._id
      );
      isMounted && setAssessments({ ...response.data });
      isMounted &&
        setAssessmentQuestionnaire({
          ...response.data.answers,
        });
      isMounted &&
        response?.data?.graphResult &&
        setGraphResult({ ...response?.data?.graphResult });
      isMounted &&
        response?.data?.graphLevelBreakdown &&
        setGraphLevelBreakdown({
          ...response?.data?.graphLevelBreakdown,
        });

      fetchQuestionnaire(
        response?.data?.questionnaireId,
        response?.data?.graphResult,
        response?.data?.graphLevelBreakdown,
        isMounted,
        controller
      );
      setReOpenAssessmentDialogBox(
        response?.data?.isSubmitted && !params["*"].includes("view")
      );
      setOpenDeleteDialogBox(
        userAuth._id === response?.data?.assignedOperationMember?._id &&
          !params["*"].includes("view") &&
          response?.data?.assessmentStatus == "Pending"
      );
    } catch (error) {
      Logger.info(
        `Fill Assessment - fetchAssessments handler catch error ${error?.response?.data?.message}`
      );
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.status === 401) {
        isMounted &&
          setToasterDetails(
            {
              titleMessage: "Oops!",
              descriptionMessage: "Session Timeout: Please login again",
              messageType: "error",
            },
            () => myRef.current()
          );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Invalid assessment!"
      ) {
        isMounted &&
          setToasterDetails(
            {
              titleMessage: "Oops!",
              descriptionMessage:
                "Oops!! There is some error while saving assessment details. Either someone has removed this assessment or looks like invalid assessment getting submitted. For more details please contact system / CGF admin",
              messageType: "error",
            },
            () => myRef.current()
          );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 3000);
      }
      setIsFillAssessmentLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    fetchAssessments(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [saveAsDraftDependency]);

  const myRef = useRef();

  const saveAssessmentAsDraft = async (
    saveAsDraft,
    reOpen,
    assessmentquestionAnswers
  ) => {
    try {
      const response = await privateAxios.post(
        saveAsDraft
          ? SUBMIT_ASSESSMENT_AS_DRAFT + params.id
          : SUBMIT_ASSESSMENT_AS_DRAFT + params.id + "/submit",
        {
          ...assessmentquestionAnswers,
        }
      );
      if (response.status == 201) {
        saveAsDraft &&
          graphResult &&
          setSaveAsDraftDependency(!saveAsDraftDependency);
        setChartImages({});
        !reOpen &&
          setToasterDetails(
            {
              titleMessage: "Success",
              descriptionMessage: response?.data?.message,
              messageType: "success",
            },
            () => myRef.current()
          );

        !reOpen &&
          setTimeout(() => {
            !saveAsDraft && navigate("/assessment-list");
            setDisableFillAssessment(false);
          }, 5000);
      }
    } catch (error) {
      setDisableFillAssessment(false);
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Invalid assessment!"
      ) {
        console.log("in invalid assessment");
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage:
              "Oops!! There is some error while saving assessment details. Either someone has removed this assessment or looks like invalid assessment getting submitted. For more details please contact system / CGF admin",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 3000);
      }
    }
  };

  const handleFormSubmit = (e, saveAsDraft) => {
    Logger.info("Fill assessment - handleFormSubmit handler");

    e.preventDefault();
    const tempErrors = {};
    let sections = [];
    let tempAsssessmentQuestionnaire = { ...assessmentQuestionnaire };

    questionnaire?.sections?.map((section, index) => {
      let sectionErrors = errors[section?.uuid] ?? {};
      let currentSectionAnswers = assessmentQuestionnaire[section?.uuid] ?? {};

      if (section?.layout === "table") {
        const transformedColValues = getTransformedColumns(
          section?.columnValues
        );

        Logger.info(
          "Fill assessment - handleFormSubmit - transformed column values"
        );
        // currentSectionAnswers
        Object.keys(currentSectionAnswers).forEach((answersKeys) => {
          let tempRowId = answersKeys?.split("_")[1];
          section?.columnValues?.forEach((column) => {
            if (
              column.columnType !== "prefilled" &&
              saveAsDraft === false &&
              column?.isRequired &&
              (!currentSectionAnswers[`${column?.uuid}_${tempRowId}`] ||
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`].length ===
                  0)
            ) {
              sectionErrors[`${column?.uuid}_${tempRowId}`] =
                "This is required field";
              sections.push(index);
            } else if (
              column.columnType === "dropdown" &&
              currentSectionAnswers[`${column?.uuid}_${tempRowId}`] &&
              !column.options?.includes(
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
              )
            ) {
              Logger.info(
                "Fill Assessment - handleFormSubmit - Fetched value not present in column dropdown options"
              );
              sectionErrors[`${column?.uuid}_${tempRowId}`] = `Entered value "${
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
              }" is not part of above list. Please select valid option among listed values from list.


                            `;
              sections.push(index);
              tempAsssessmentQuestionnaire = {
                ...tempAsssessmentQuestionnaire,
                [section?.uuid]: {
                  ...tempAsssessmentQuestionnaire[section?.uuid],
                  [`${column?.uuid}_${tempRowId}`]: "",
                },
              };

              if (!saveAsDraft) {
                sectionErrors[`${column?.uuid}_${tempRowId}`] =
                  "This is required field";
                sections.push(index);
              }
            } else if (
              column.columnType === "date" &&
              currentSectionAnswers[`${column?.uuid}_${tempRowId}`] &&
              isNaN(
                new Date(
                  currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
                ).getTime()
              )
            ) {
              Logger.info(
                "Fill Assessment - handleFormSubmit - Fetched value not present in column date type"
              );
              sectionErrors[`${column?.uuid}_${tempRowId}`] = `Entered value "${
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
              }" is not valid date format.


                            `;
              sections.push(index);
              tempAsssessmentQuestionnaire = {
                ...tempAsssessmentQuestionnaire,
                [section?.uuid]: {
                  ...tempAsssessmentQuestionnaire[section?.uuid],
                  [`${column?.uuid}_${tempRowId}`]: "",
                },
              };
            } else if (
              column.columnType !== "prefilled" &&
              column?.validation == "alphabets" &&
              currentSectionAnswers[`${column?.uuid}_${tempRowId}`]?.length >
                0 &&
              !AlphaRegEx.test(
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
              )
            ) {
              sectionErrors[`${column?.uuid}_${tempRowId}`] =
                "This is an alphabetic field.";
              sections.push(index);
            } else if (
              column?.columnType !== "prefilled" &&
              column?.validation == "numeric" &&
              currentSectionAnswers[`${column?.uuid}_${tempRowId}`]?.length >
                0 &&
              !NumericRegEx.test(
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
              )
            ) {
              sectionErrors[`${column?.uuid}_${tempRowId}`] =
                "This is a numeric field.";
              Logger.info(
                "Fill Assessment - handleFormSubmit - in table numeric only"
              );
              sections.push(index);
            } else if (
              column.columnType !== "prefilled" &&
              column?.validation == "alphanumeric" &&
              currentSectionAnswers[`${column?.uuid}_${tempRowId}`]?.length >
                0 &&
              !AlphaNumRegEx.test(
                currentSectionAnswers[`${column?.uuid}_${tempRowId}`]
              )
            ) {
              sectionErrors[`${column?.uuid}_${tempRowId}`] =
                " This is an alphanumeric field.";
              Logger.info(
                "Fill Assessment - handleFormSubmit - in table alphanumeric only"
              );
              sections.push(index);
            } else {
              delete sectionErrors[`${column?.uuid}_${tempRowId}`];
            }
          });
        });
        Logger.info(
          "Fill Assessment - handleFormSubmit - Section errors in table layout "
        );
      } else {
        // form validators
        section?.questions.forEach((question) => {
          if (
            question.isRequired &&
            (!currentSectionAnswers[question?.uuid] ||
              currentSectionAnswers[question?.uuid].length === 0) &&
            saveAsDraft === false
          ) {
            Logger.info(
              "Fill Assessment - handleFormSubmit - error from required"
            );

            sectionErrors[question?.uuid] = "This is required field";
            sections.push(index);
          } else if (
            (question.inputType == "radioGroup" ||
              question.inputType == "dropdown") &&
            currentSectionAnswers[question?.uuid] &&
            !question.options.includes(currentSectionAnswers[question?.uuid])
          ) {
            Logger.info(
              "Fill Assessment - handleFormSubmit - error from radio group question"
            );

            sectionErrors[question?.uuid] = `
                        
                        Entered value
                        "${
                          currentSectionAnswers[question?.uuid]
                        }" is not part of above list. Please select valid option among listed values from list.
                        `;
            tempAsssessmentQuestionnaire = {
              ...tempAsssessmentQuestionnaire,
              [section?.uuid]: {
                ...tempAsssessmentQuestionnaire[section?.uuid],
                [question?.uuid]: "",
              },
            };
            sections.push(index);
          } else if (
            question.inputType == "checkbox" &&
            currentSectionAnswers[question?.uuid]
          ) {
            let answerOptions = currentSectionAnswers[question?.uuid];
            if (typeof answerOptions === "string") {
              answerOptions = currentSectionAnswers[question?.uuid].split(",");
            }
            Logger.info(
              "Fill Assessment - handleFormSubmit - error from checkbox question"
            );

            let optionsFromQuestion = question.options;
            let optionsPresentInBothAnswerAndQuestionList =
              answerOptions &&
              answerOptions?.filter((option) =>
                optionsFromQuestion?.includes(option)
              );

            if (optionsPresentInBothAnswerAndQuestionList.length === 0) {
              sectionErrors[question?.uuid] = `
                        
                        Entered value
                        "${
                          currentSectionAnswers[question?.uuid]
                        }" is not part of above list. Please select valid option among listed values from list.
                        `;
              sections.push(index);
            } else {
              delete sectionErrors[question?.uuid];
            }
            tempAsssessmentQuestionnaire = {
              ...tempAsssessmentQuestionnaire,
              [section?.uuid]: {
                ...tempAsssessmentQuestionnaire[section?.uuid],
                [question?.uuid]: optionsPresentInBothAnswerAndQuestionList,
              },
            };
          } else if (
            question.validation === "alphabets" &&
            currentSectionAnswers[question?.uuid] &&
            AlphaRegEx.test(currentSectionAnswers[question?.uuid]) === false
          ) {
            Logger.info(
              "Fill Assessment - handleFormSubmit - error from numric if elese"
            );

            sectionErrors[question?.uuid] = "This is an alphabetic field";
            sections.push(index);
          } else if (
            question.validation === "numeric" &&
            currentSectionAnswers[question?.uuid] &&
            NumericRegEx.test(currentSectionAnswers[question?.uuid]) === false
          ) {
            sectionErrors[question?.uuid] = "This is a numeric field";
            sections.push(index);
          } else if (
            question.validation === "alphanumeric" &&
            currentSectionAnswers[question?.uuid] &&
            AlphaNumRegEx.test(currentSectionAnswers[question?.uuid]) === false
          ) {
            sectionErrors[question?.uuid] = " This is an alphanumeric field";
            sections.push(index);
          } else if (
            question.inputType === "date" &&
            currentSectionAnswers[question?.uuid] &&
            isNaN(new Date(currentSectionAnswers[question?.uuid]).getTime())
          ) {
            Logger.info(
              "Fill Assessment - handleFormSubmit - error from date question"
            );

            sectionErrors[question?.uuid] = `
                        
                        Entered value
                        "${
                          currentSectionAnswers[question?.uuid]
                        }" is not valid date.
                        `;
            tempAsssessmentQuestionnaire = {
              ...tempAsssessmentQuestionnaire,
              [section?.uuid]: {
                ...tempAsssessmentQuestionnaire[section?.uuid],
                [question?.uuid]: "",
              },
            };
            sections.push(index);
          } else {
            delete sectionErrors[question?.uuid];
          }
        });
      }

      setTabValue(sections.length > 0 ? sections[0] : 0);

      tempErrors[section?.uuid] = { ...sectionErrors };
    });
    setAssessmentQuestionnaire({ ...tempAsssessmentQuestionnaire });

    handleSetErrors(tempErrors);
    const isValidated = Object.keys(tempErrors).every(
      (key) => Object.keys(tempErrors[key]).length === 0
    );
    if (isValidated) {
      setDisableFillAssessment(true);
      saveAssessmentAsDraft(
        saveAsDraft,
        undefined,
        tempAsssessmentQuestionnaire
      );
    }
  };

  // API for declining assessments
  const onSubmitReason = async (data) => {
    Logger.info("Fill Assessment - onSubmitReason handler");
    try {
      const response = await privateAxios.post(
        DECLINE_ASSESSMENT + params.id + "/decline",
        {
          comment: data.comment,
        }
      );
      if (response.status == 201) {
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: response?.data?.message,
            messageType: "success",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 3000);
      }
    } catch (error) {
      Logger.info(
        `Fill Assessment - onSubmitReason handler - catch error - ${error?.response?.data?.message}`
      );
      handleCatchError(error, "onSubmitReason");
    }
    setOpenDeleteDialogBox(false);
  };

  //API for accepting assessments
  const onAcceptAssessments = async () => {
    try {
      const response = await privateAxios.post(
        ACCEPT_ASSESSMENT + params.id + "/accept"
      );
      if (response.status == 201) {
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: response?.data?.message,

            messageType: "success",
          },
          () => myRef.current()
        );
        setOpenDeleteDialogBox(false);
      }
    } catch (error) {
      handleCatchError(error, "onAcceptAssessments");

      setOpenDeleteDialogBox(false);
    }
  };

  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };

  const handleCloseRedirect = () => {
    navigate("/assessment-list");
  };

  const handleReOpenAssessment = () => {
    saveAssessmentAsDraft(true, true, assessmentQuestionnaire);
    setReOpenAssessmentDialogBox(false);
  };
  const handleCloseReopenAssessment = () => {
    setReOpenAssessmentDialogBox(false);
    navigate("/assessment-list");
  };
  const [selectedFileName, setSelectedFileName] = useState("");
  const handleImportExcel = (e) => {
    setDisableImport(false);
    setSelectedFileName(e.target.files[0].name);
    setFile(e.target.files[0]);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };
  const handleDownloadAssessment = async () => {
    try {
      if (graphLevelBreakdown && graphResult) {
        const response = await privateAxios.post(
          DOWNLOAD_ASSESSMENT_BY_ID + params.id + "/download",
          { ...chartImages },
          { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement(`a`);
        link.href = url;
        let timeStamp = getTimeStamp();
        link.setAttribute(`download`, `Assessment - ${timeStamp}.xlsx`);
        document.body.appendChild(link);
        link.click();
        if (response.status == 201) {
          setToasterDetails(
            {
              titleMessage: `Success!`,
              descriptionMessage: "Downloaded Successfully!",

              messageType: `success`,
            },
            () => myRef.current()
          );
        }
      } else {
        await downloadFunction(
          "Assessment",
          setToasterDetails,
          params.id,
          myRef,
          DOWNLOAD_ASSESSMENT_BY_ID,
          navigate
        );
      }
      // API Call
      // method call
    } catch (error) {
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Invalid assessment!"
      ) {
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage:
              "Oops!! There is some error while saving assessment details. Either someone has removed this assessment or looks like invalid assessment getting submitted. For more details please contact system / CGF admin",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 3000);
      } else {
        catchError(error, setToasterDetails, myRef, navigate);
      }
    }
  };

  const [importOpenDialog, setImportOpenDialog] = useState(false);

  const reUploadAssessment = () => {
    setIsFillAssessmentLoading(true);
    try {
      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        if (
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          reader.onloadend = async () => {
            let result = reader.result;
            let encryptedFile = CryptoJs.AES.encrypt(
              result,
              REACT_APP_FILE_ENCRYPT_SECRET
            ).toString();
            try {
              setDisableImport(true);
              const response = await privateAxios.post(
                IMPORT_ASSESSMENT + `${params.id}/upload`,
                {
                  encryptedFile,
                }
              );

              if (response.status == 201) {
                setIsFillAssessmentLoading(false);

                setFile("");
                setSelectedFileName("");
                setDisableImport(true);
                setImportOpenDialog(false);
                setToasterDetails(
                  {
                    titleMessage: "Success",
                    descriptionMessage: "Successfully imported excel file!",
                    messageType: "success",
                  },
                  () => myRef.current()
                );

                setAssessmentQuestionnaire(response.data.answers);
                addTableAssessmentValues();
                if (response.data.containsErrors) {
                  try {
                    const correctionDocResponse = await privateAxios.get(
                      IMPORT_ASSESSMENT +
                        `${response.data.correctionId}/corrections`,
                      {
                        responseType: "blob",
                      }
                    );

                    const url = window.URL.createObjectURL(
                      new Blob([correctionDocResponse.data])
                    );
                    const link = document.createElement(`a`);
                    link.href = url;
                    let timeStamp = getTimeStamp();
                    link.setAttribute(
                      `download`,
                      `Corrections - ${timeStamp}.xlsx`
                    );
                    document.body.appendChild(link);
                    link.click();
                    setInvalidAssessmentDialogBox(true);
                    setToasterDetails(
                      {
                        titleMessage: "error",
                        descriptionMessage: (
                          <p>
                            Excel file has missing/invalid fields.Please check{" "}
                            <b>Corrections sheet</b> attached with it".
                          </p>
                        ),
                        messageType: "error",
                      },
                      () => myRef.current()
                    );
                  } catch (error) {
                    setIsFillAssessmentLoading(false);

                    Logger.info(
                      `Fill Assessment - reUploadAssessment - correctionDocResponse catch error - Error from corections doc download`
                    );
                  }
                }
              }
            } catch (error) {
              Logger.info(
                `Fill Assessment - reUploadAssessment -  ${error?.response?.data?.message}`
              );

              setDisableImport(true);
              setIsFillAssessmentLoading(false);
              setSelectedFileName("");
              if (
                error?.response?.status === 400 &&
                error?.response?.data?.message === "Invalid assessment!"
              ) {
                setToasterDetails(
                  {
                    titleMessage: "Oops!",
                    descriptionMessage:
                      "Oops!! There is some error while saving assessment details. Either someone has removed this assessment or looks like invalid assessment getting submitted. For more details please contact system / CGF admin",
                    messageType: "error",
                  },
                  () => myRef.current()
                );
              } else {
                catchError(error, setToasterDetails, myRef, navigate);
              }
            } finally {
              setIsFillAssessmentLoading(false);
            }
          };
        } else {
          setFile("");
          setSelectedFileName("");
          disableImport(true);
          setIsFillAssessmentLoading(false);

          return setToasterDetails(
            {
              titleMessage: "error",
              descriptionMessage: "Invalid file type Please uplaod excel file",
              messageType: "error",
            },
            () => myRef.current()
          );
        }
      } else {
        setIsFillAssessmentLoading(false);

        setIsFillAssessmentLoading(false);
        return setToasterDetails(
          {
            titleMessage: "error",
            descriptionMessage: "Please select excel file",
            messageType: "error",
          },
          () => myRef.current()
        );
      }
    } catch (error) {
      setFile("");
      setSelectedFileName("");
      setDisableImport(true);
      setIsFillAssessmentLoading(false);

      Logger.info(
        `Fill assessment -reUploadAssessment - ${error?.response?.data?.message}`
      );
    }
  };

  const cancelImport = () => {
    setFile("");
    setSelectedFileName("");
    setIsFillAssessmentLoading(false);
    setDisableImport(true);

    setImportOpenDialog(false);
  };
  const addTableAssessmentValues = () => {
    Logger.info(`Fill Assessment - addTableAssessmentValues handler`);
    if (questionnaire && Object.keys(questionnaire)?.length > 0) {
      questionnaire?.sections?.forEach((section) => {
        if (
          section?.layout === "table" &&
          (!assessmentQuestionnaire[section?.uuid] ||
            Object.keys(assessmentQuestionnaire[section?.uuid]).length === 0)
        ) {
          let tempAsssessmentQuestionnaire = {
            ...assessmentQuestionnaire,
          };
          tempAsssessmentQuestionnaire[section?.uuid] = {};
          section?.rowValues.forEach((row) => {
            section?.columnValues?.forEach((column) => {
              tempAsssessmentQuestionnaire[section?.uuid][
                `${column?.uuid}_${row?.uuid}`
              ] = "";
            });
          });

          setAssessmentQuestionnaire(tempAsssessmentQuestionnaire);
        }
      });
    }
  };
  addTableAssessmentValues();
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <DialogBox
        title={<p>Accept/Reject Assessment </p>}
        info1={
          <p className="accrej-txtwrap">
            <span className="accrej-txtblk">
              <span className="accrej-label">
                Assessment title <span>:</span>
              </span>
              {assessment?.title?.length <= 36 ? (
                <span className="accrej-desc">{assessment?.title}</span>
              ) : (
                <Tooltip title={assessment?.title}>
                  <span className="accrej-desc">
                    {" "}
                    {assessment?.title?.slice(0, 39)}...
                  </span>
                </Tooltip>
              )}
              {/* <span className="accrej-desc">
                                {assessment?.title}
                            </span> */}
            </span>
            <span className="accrej-txtblk">
              <span className="accrej-label">
                Assessment type <span>:</span>
              </span>

              {assessment?.assessmentType?.length <= 36 ? (
                <span className="accrej-desc">
                  {assessment?.assessmentType}
                </span>
              ) : (
                <Tooltip title={assessment?.assessmentType}>
                  <span className="accrej-desc">
                    {" "}
                    {assessment?.assessmentType?.slice(0, 39)}
                    ...
                  </span>
                </Tooltip>
              )}
            </span>
            <span className="accrej-txtblk">
              <span className="accrej-label">
                Member company <span>:</span>
              </span>
              {assessment?.assignedMember?.companyName?.length <= 36 ? (
                <span className="accrej-desc">
                  {assessment?.assignedMember?.companyName}
                </span>
              ) : (
                <Tooltip title={assessment?.assignedMember?.companyName}>
                  <span className="accrej-desc">
                    {" "}
                    {assessment?.assignedMember?.companyName?.slice(0, 39)}
                    ...
                  </span>
                </Tooltip>
              )}
              {/* <span className="accrej-desc">
                                {assessment?.assignedMember?.companyName}
                            </span> */}
            </span>
            <span className="accrej-txtblk">
              <span className="accrej-label">
                Due date <span>:</span>
              </span>
              <span className="accrej-desc">
                {new Date(
                  new Date(assessment?.dueDate).setDate(
                    new Date(assessment?.dueDate).getDate() - 1
                  )
                ).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </span>
            Click “Accept” if you want to fill out the assessment, or else
            provide a reason and reject the assessment, if you don’t want to
            continue with it.
          </p>
        }
        info2={
          <Controller
            name="comment"
            control={control}
            rules={{
              required: true,
              minLength: 3,
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                multiline
                {...field}
                onBlur={(e) => setValue("comment", e.target.value?.trim())}
                inputProps={{
                  maxLength: 250,
                }}
                className={`input-textarea ${error && "input-textarea-error"}`}
                style={{ marginBottom: "10px" }}
                id="outlined-basic"
                placeholder="Enter reason"
                helperText={
                  error ? helperTextForReason.comment[error.type] : " "
                }
                variant="outlined"
              />
            )}
          />
        }
        primaryButtonText={"Accept"}
        secondaryButtonText={"Reject"}
        onPrimaryModalButtonClickHandler={() => {
          onAcceptAssessments();
        }}
        onSecondaryModalButtonClickHandler={handleSubmit(onSubmitReason)}
        openModal={openDeleteDialogBox}
        setOpenModal={setOpenDeleteDialogBox}
        isModalForm={true}
        handleCloseRedirect={handleCloseRedirect}
      />
      <DialogBox
        title={<p>Re-open Assessment ?</p>}
        info1={" "}
        info2={
          <p className="mb-30">
            Are you sure you want to edit the given submitted assessment?
          </p>
        }
        primaryButtonText={"Yes"}
        secondaryButtonText={"No"}
        onPrimaryModalButtonClickHandler={() => handleReOpenAssessment()}
        onSecondaryModalButtonClickHandler={() => handleCloseReopenAssessment()}
        openModal={reOpenAssessmentDialogBox}
        setOpenModal={setReOpenAssessmentDialogBox}
        isModalForm={true}
        handleCloseRedirect={handleCloseRedirect}
      />
      <DialogBox
        title={<p>Data Upload</p>}
        info1={" "}
        info2={
          <div className="upload-file-wrap">
            <Button
              variant="contained"
              component="label"
              className="upload-file-btn"
            >
              <div
                className={
                  file ? "upload-file-blk selected-file-blk" : "upload-file-blk"
                }
              >
                <input
                  type={"file"}
                  hidden
                  accept={".xls, .xlsx"}
                  ref={fileRef}
                  onChange={handleImportExcel}
                />
                <span className="upload-icon">
                  <CloudUploadOutlinedIcon />
                </span>
                <span className="file-upload-txt">
                  Click here to choose file (.xlsx)
                </span>
              </div>
            </Button>
            <p className="select-filename">{selectedFileName}</p>
          </div>
        }
        primaryButtonText={"Upload"}
        secondaryButtonText={"Cancel"}
        onPrimaryModalButtonClickHandler={() => reUploadAssessment()}
        isDisabledPrimaryButton={disableImport}
        onSecondaryModalButtonClickHandler={() => cancelImport()}
        openModal={importOpenDialog}
        setOpenModal={setImportOpenDialog}
        isModalForm={true}
        handleCloseRedirect={cancelImport}
      />
      <DialogBox
        title={<p>Alert</p>}
        info1={" "}
        info2={
          <p className="mb-30">
            Please open the correction sheet, make necessary changes in the
            imported excel sheet and import again.
          </p>
        }
        openModal={invalidAssessmentDialogBox}
        setOpenModal={setInvalidAssessmentDialogBox}
        isModalForm={true}
        primaryButtonText={"OK"}
        onPrimaryModalButtonClickHandler={() =>
          setInvalidAssessmentDialogBox(false)
        }
        handleCloseRedirect={() => setInvalidAssessmentDialogBox(false)}
      />
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <a
                onClick={() => navigate(`/assessment-list`)}
                style={{ cursor: "pointer" }}
              >
                Assessments
              </a>
            </li>
            {params["*"].includes("view") ? (
              <li>View Assessment</li>
            ) : (
              <li>Fill Assessment</li>
            )}
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between preview-assessment-ttl">
            <h2 className="heading2">{questionnaire?.title}</h2>
            <div className="flex-between">
              <div className="tertiary-btn-blk mr-20" onClick={viewInstruction}>
                <span className="preview-icon">
                  <VisibilityOutlinedIcon />
                </span>
                <span className="addmore-txt">View Instructions</span>
              </div>

              <span className="form-header-right-txt" onClick={handleToggle}>
                <span className="crud-operation">
                  <MoreVertIcon />
                </span>
                <div
                  className="crud-toggle-wrap assessment-crud-toggle-wrap"
                  style={{
                    display: isActive ? "block" : "none",
                  }}
                >
                  <ul className="crud-toggle-list">
                    <li onClick={() => handleDownloadAssessment()}>
                      Export to Excel
                    </li>
                    {params["*"].includes("view") || (
                      <li onClick={() => setImportOpenDialog(true)}>
                        Import File
                      </li>
                    )}
                  </ul>
                </div>
              </span>
            </div>
            <div className="excel-short-name">
              <p>{questionnaire?.sheetName ?? ""}</p>
            </div>
          </div>

          <div className="section-form-sect">
            <div className="section-tab-blk flex-between preview-tab-blk">
              <div className="section-tab-leftblk">
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                  className="tabs-sect que-tab-sect"
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {questionnaire?.sections?.map((section, index, id) => (
                      <Tooltip
                        key={section?.uuid}
                        title={section.sectionTitle}
                        placement="bottom-start"
                      >
                        <Tab
                          className="section-tab-item"
                          label={`section ${index + 1}`}
                          {...a11yProps(index)}
                        />
                      </Tooltip>
                    ))}
                    {graphResult && graphLevelBreakdown && (
                      <Tab
                        className="section-tab-item"
                        label="Results"
                        {...a11yProps(questionnaire?.sections?.length)}
                      />
                    )}
                  </Tabs>
                </Box>
              </div>
            </div>
            {isFillAssessmentLoading ? (
              <Loader />
            ) : (
              <div className="preview-tab-data">
                {questionnaire?.sections?.map((section, index) => (
                  <TabPanel value={value} index={index} key={section?.uuid}>
                    <FillAssesmentSection
                      assessmentQuestionnaire={assessmentQuestionnaire}
                      disableFillAssessment={disableFillAssessment}
                      setAssessmentQuestionnaire={setAssessmentQuestionnaire}
                      section={section}
                      questionnaireTitle={questionnaire?.title}
                      errorQuestion={errorQuestion}
                      setErrorQuestion={setErrorQuestion}
                      errorQuestionUUID={errorQuestionUUID}
                      setErrorQuestionUUID={setErrorQuestionUUID}
                      errors={errors[section?.uuid] ?? {}}
                      handleFormSubmit={handleFormSubmit}
                      editMode={editMode}
                      setEditMode={setEditMode}
                      index={index}
                      totalSections={questionnaire?.sections?.length}
                      setToasterDetails={setToasterDetails}
                      myRef={myRef}
                    />
                  </TabPanel>
                ))}

                {graphLevelBreakdown && graphResult && (
                  <TabPanel
                    value={value}
                    index={questionnaire?.sections?.length}
                  >
                    <Charts
                      chartImages={chartImages}
                      setChartImages={setChartImages}
                      questionnaireTitle={questionnaire?.title}
                      graphResult={graphResult}
                      graphLevelBreakdown={graphLevelBreakdown}
                    />
                  </TabPanel>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FillAssessment;

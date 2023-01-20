import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
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
import DialogBox from "../../components/DialogBox";
import Toaster from "../../components/Toaster";
import { downloadFunction } from "../../utils/downloadFunction";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Loader from "../../utils/Loader";
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
    },
};

function FillAssessment() {
    //custom hook to set title of page
    useDocumentTitle("Fill Assessment");
    //   state to manage loaders
    const [isFillAssessmentLoading, setIsFillAssessmentLoading] =
        useState(false);
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
    const [errorQuestion, setErrorQuestion] = useState("");
    const [errorQuestionUUID, setErrorQuestionUUID] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [errors, setErrors] = useState({});
    const [reOpenAssessmentDialogBox, setReOpenAssessmentDialogBox] =
        useState(false);

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
        console.log("error occured in ", functionName);
        if (error?.response?.status === 401) {
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
        } else {
            setToasterDetails(
                {
                    titleMessage: "Error",
                    descriptionMessage:
                        error?.response?.data?.message &&
                        typeof error.response.data.message === "string"
                            ? error.response.data.message
                            : "Something went wrong.",
                    messageType: "error",
                },
                () => myRef.current()
            );
        }
    };

    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();

        const fetchQuestionnaire = async (id) => {
            try {
                const response = await privateAxios.get(
                    `${ADD_QUESTIONNAIRE}/${id}`,
                    {
                        signal: controller.signal,
                    }
                );
                isMounted && setQuestionnaire({ ...response.data });
            } catch (error) {
                if (error?.code === "ERR_CANCELED") return;

                console.log("error from fetch questionnaire", error);
                if (error?.response?.status === 401) {
                    isMounted &&
                        setToasterDetails(
                            {
                                titleMessage: "Oops!",
                                descriptionMessage:
                                    "Session Timeout: Please login again",
                                messageType: "error",
                            },
                            () => myRef.current()
                        );
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
            }
        };

        const fetchAssessments = async () => {
            try {
                setIsFillAssessmentLoading(true);
                const response = await privateAxios.get(
                    `${FETCH_ASSESSMENT_BY_ID}${params.id}`,
                    {
                        signal: controller.signal,
                    }
                );
                setIsFillAssessmentLoading(false);
                console.log("response from fetch assessment", response);
                setEditMode(
                    userAuth?._id ===
                        response?.data?.assignedOperationMember?._id
                );
                isMounted && setAssessments({ ...response.data });
                isMounted &&
                    setAssessmentQuestionnaire({
                        ...response.data.answers,
                    });
                fetchQuestionnaire(response?.data?.questionnaireId);
                setReOpenAssessmentDialogBox(
                    response?.data?.isSubmitted && !params["*"].includes("view")
                );
                setOpenDeleteDialogBox(
                    userAuth._id ===
                        response?.data?.assignedOperationMember?._id &&
                        !params["*"].includes("view") &&
                        response?.data?.assessmentStatus == "Pending"
                );
            } catch (error) {
                if (error?.code === "ERR_CANCELED") return;
                if (error?.response?.status === 401) {
                    isMounted &&
                        setToasterDetails(
                            {
                                titleMessage: "Oops!",
                                descriptionMessage:
                                    "Session Timeout: Please login again",
                                messageType: "error",
                            },
                            () => myRef.current()
                        );
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
                setIsFillAssessmentLoading(false);
                console.log("error from fetch assessment", error);
            }
        };
        fetchAssessments();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

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
                        navigate("/assessment-list");
                    }, 3000);
            }
        } catch (error) {
            handleCatchError(error, "saveAssessmentAsDraft");
        }
    };

    const handleFormSubmit = (e, saveAsDraft) => {
        e.preventDefault();
        const tempErrors = {};
        let sections = [];
        let tempAsssessmentQuestionnaire = { ...assessmentQuestionnaire };

        questionnaire?.sections?.map((section, index) => {
            let sectionErrors = errors[section?.uuid] ?? {};
            let currentSectionAnswers =
                assessmentQuestionnaire[section?.uuid] ?? {};

            if (section?.layout === "table") {
                const transformedColValues = getTransformedColumns(
                    section?.columnValues
                );
                console.log(
                    "curren assessment Questionnaire:- ",
                    currentSectionAnswers
                );
                console.log(
                    "transformed column values:- ",
                    transformedColValues
                );
                // currentSectionAnswers
                Object.keys(currentSectionAnswers).forEach((answersKeys) => {
                    let tempRowId = answersKeys?.split(".")[1];
                    section?.columnValues?.forEach((column) => {
                        if (
                            column.columnType !== "prefilled" &&
                            saveAsDraft === false &&
                            column?.isRequired &&
                            (!currentSectionAnswers[
                                `${column?.uuid}.${tempRowId}`
                            ] ||
                                currentSectionAnswers[
                                    `${column?.uuid}.${tempRowId}`
                                ].length === 0)
                        ) {
                            sectionErrors[`${column?.uuid}.${tempRowId}`] =
                                "This is required field";
                            sections.push(index);
                        } else if (
                            column.columnType === "dropdown" &&
                            currentSectionAnswers[
                                `${column?.uuid}.${tempRowId}`
                            ] &&
                            !column.options.includes(
                                currentSectionAnswers[
                                    `${column?.uuid}.${tempRowId}`
                                ]
                            )
                        ) {
                            console.log(
                                "Fetched value not present in column dropdown options"
                            );
                            sectionErrors[
                                `${column?.uuid}.${tempRowId}`
                            ] = `Entered value "${
                                currentSectionAnswers[
                                    `${column?.uuid}.${tempRowId}`
                                ]
                            }" is not part of above list. Please select valid option among listed values from list.


                            `;
                            sections.push(index);
                            console.log("sections = ", sections);
                            tempAsssessmentQuestionnaire = {
                                ...tempAsssessmentQuestionnaire,
                                [section?.uuid]: {
                                    ...tempAsssessmentQuestionnaire[
                                        section?.uuid
                                    ],
                                    [`${column?.uuid}.${tempRowId}`]: "",
                                },
                            };

                            if (!saveAsDraft) {
                                sectionErrors[`${column?.uuid}.${tempRowId}`] =
                                    "This is required field";
                                sections.push(index);
                            }
                        } else if (
                            column.columnType !== "prefilled" &&
                            column?.validation == "alphabets" &&
                            currentSectionAnswers[
                                `${column?.uuid}.${tempRowId}`
                            ]?.length > 0 &&
                            !AlphaRegEx.test(
                                currentSectionAnswers[
                                    `${column?.uuid}.${tempRowId}`
                                ]
                            )
                        ) {
                            sectionErrors[`${column?.uuid}.${tempRowId}`] =
                                "This is alphabets only field";
                            console.log("in table alphabets only");
                            sections.push(index);
                        } else if (
                            column?.columnType !== "prefilled" &&
                            column?.validation == "numeric" &&
                            currentSectionAnswers[
                                `${column?.uuid}.${tempRowId}`
                            ]?.length > 0 &&
                            !NumericRegEx.test(
                                currentSectionAnswers[
                                    `${column?.uuid}.${tempRowId}`
                                ]
                            )
                        ) {
                            sectionErrors[`${column?.uuid}.${tempRowId}`] =
                                "This is numeric only field";
                            console.log("in table numeric only");
                            sections.push(index);
                        } else if (
                            column.columnType !== "prefilled" &&
                            column?.validation == "alphanumeric" &&
                            currentSectionAnswers[
                                `${column?.uuid}.${tempRowId}`
                            ]?.length > 0 &&
                            !AlphaNumRegEx.test(
                                currentSectionAnswers[
                                    `${column?.uuid}.${tempRowId}`
                                ]
                            )
                        ) {
                            sectionErrors[`${column?.uuid}.${tempRowId}`] =
                                "This is alphanumeric field";
                            console.log("in table alphanumeric only");
                            sections.push(index);
                        } else {
                            delete sectionErrors[
                                `${column?.uuid}.${tempRowId}`
                            ];
                        }
                    });
                });
                console.log("Section errors in table layout ", sectionErrors);
            } else {
                // form validators
                section?.questions.forEach((question) => {
                    if (
                        question.isRequired &&
                        (!currentSectionAnswers[question?.uuid] ||
                            currentSectionAnswers[question?.uuid].length ===
                                0) &&
                        saveAsDraft === false
                    ) {
                        console.log("error from required");
                        console.log("section no", index);
                        sectionErrors[question?.uuid] =
                            "This is required field";
                        sections.push(index);
                    } else if (
                        question.inputType == "dropdown" &&
                        currentSectionAnswers[question?.uuid] &&
                        !question.options.includes(
                            currentSectionAnswers[question?.uuid]
                        )
                    ) {
                        console.log("error from dropdown question");
                        console.log("section no", index);
                        console.log("section no", sections);

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
                        question.validation === "alphabets" &&
                        currentSectionAnswers[question?.uuid] &&
                        AlphaRegEx.test(
                            currentSectionAnswers[question?.uuid]
                        ) === false
                    ) {
                        console.log("error from numric if elese");

                        sectionErrors[question?.uuid] =
                            "Please enter alphabets field";
                        sections.push(index);
                    } else if (
                        question.validation === "numeric" &&
                        currentSectionAnswers[question?.uuid] &&
                        NumericRegEx.test(
                            currentSectionAnswers[question?.uuid]
                        ) === false
                    ) {
                        sectionErrors[question?.uuid] = "This is numeric field";
                        sections.push(index);
                    } else if (
                        question.validation === "alphanumeric" &&
                        currentSectionAnswers[question?.uuid] &&
                        AlphaNumRegEx.test(
                            currentSectionAnswers[question?.uuid]
                        ) === false
                    ) {
                        sectionErrors[question?.uuid] =
                            "This is alphanumeric field";
                        sections.push(index);
                    } else {
                        delete sectionErrors[question?.uuid];
                    }
                });
            }

            setTabValue(sections.length > 0 ? sections[0] : 0);
            console.log("Section errors in  ", sectionErrors);
            console.log("Section : ", sections);

            tempErrors[section?.uuid] = { ...sectionErrors };
        });
        setAssessmentQuestionnaire({ ...tempAsssessmentQuestionnaire });

        handleSetErrors(tempErrors);
        const isValidated = Object.keys(tempErrors).every(
            (key) => Object.keys(tempErrors[key]).length === 0
        );
        if (isValidated) {
            saveAssessmentAsDraft(
                saveAsDraft,
                undefined,
                tempAsssessmentQuestionnaire
            );
        }
    };

    // API for declining assessments
    const onSubmitReason = async (data) => {
        try {
            const response = await privateAxios.post(
                DECLINE_ASSESSMENT + params.id + "/decline",
                {
                    comment: data.comment,
                }
            );
            console.log(
                "Response from backend for decline assessment",
                response
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
        setSelectedFileName(e.target.files[0].name);
        setFile(e.target.files[0]);
    };

    const handleDownloadAssessment = async () => {
        try {
            await downloadFunction(
                "Assessment",
                setToasterDetails,
                params.id,
                myRef,
                DOWNLOAD_ASSESSMENT_BY_ID,
                navigate
            );
        } catch (error) {}
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

                                setImportOpenDialog(false);
                                setToasterDetails(
                                    {
                                        titleMessage: "Success",
                                        descriptionMessage:
                                            "Successfully imported excel file!",
                                        messageType: "success",
                                    },
                                    () => myRef.current()
                                );

                                setAssessmentQuestionnaire(
                                    response.data.answers
                                );

                                if (response.data.containsErrors) {
                                    try {
                                        const correctionDocResponse =
                                            await privateAxios.get(
                                                IMPORT_ASSESSMENT +
                                                    `${response.data.correctionId}/corrections`,
                                                {
                                                    responseType: "blob",
                                                }
                                            );

                                        const url = window.URL.createObjectURL(
                                            new Blob([
                                                correctionDocResponse.data,
                                            ])
                                        );
                                        const link =
                                            document.createElement(`a`);
                                        link.href = url;
                                        link.setAttribute(
                                            `download`,
                                            `Corrections - ${new Date().toLocaleString(
                                                "en"
                                            )}.xlsx`
                                        );
                                        document.body.appendChild(link);
                                        link.click();
                                        setToasterDetails(
                                            {
                                                titleMessage: "error",
                                                descriptionMessage: (
                                                    <p>
                                                        Excel file has
                                                        missing/invalid
                                                        fields.Please check{" "}
                                                        <b>Corrections sheet</b>{" "}
                                                        attached with it!".
                                                    </p>
                                                ),
                                                messageType: "error",
                                            },
                                            () => myRef.current()
                                        );
                                    } catch (error) {
                                        setIsFillAssessmentLoading(false);

                                        console.log(
                                            "Error from corections doc download",
                                            error
                                        );
                                    }
                                }
                            }
                        } catch (error) {
                            console.log("Error from UPLOAD api", error);
                            setIsFillAssessmentLoading(false);
                            handleCatchError(error, "reuploadAssessment");
                            setImportOpenDialog(false);
                        }
                    };
                } else {
                    return setToasterDetails(
                        {
                            titleMessage: "error",
                            descriptionMessage:
                                "Invalid file type Please uplaod excel file!",
                            messageType: "error",
                        },
                        () => myRef.current()
                    );
                }
            } else {
                return setToasterDetails(
                    {
                        titleMessage: "error",
                        descriptionMessage: "Please select excel file!",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
            }
        } catch (error) {
            console.log("error in reupload assessment", error);
        }
    };

    const cancelImport = () => {
        setFile("");
        setSelectedFileName("");

        setImportOpenDialog(false);
    };
    const addTableAssessmentValues = () => {
        if (questionnaire && Object.keys(questionnaire)?.length > 0) {
            questionnaire?.sections?.forEach((section) => {
                if (
                    section?.layout === "table" &&
                    !assessmentQuestionnaire[section?.uuid]
                ) {
                    let tempAsssessmentQuestionnaire = {
                        ...assessmentQuestionnaire,
                    };
                    tempAsssessmentQuestionnaire[section?.uuid] = {};
                    section?.rowValues.forEach((row) => {
                        section?.columnValues?.forEach((column) => {
                            tempAsssessmentQuestionnaire[section?.uuid][
                                `${column?.uuid}.${row?.uuid}`
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
        <div
            className="page-wrapper"
            onClick={() => isActive && setActive(false)}
        >
            <DialogBox
                title={<p>Accept/Reject Assessment </p>}
                info1={
                    <p className="accrej-txtwrap">
                        <span className="accrej-txtblk">
                            <span className="accrej-label">
                                Assessment title <span>:</span>
                            </span>
                            <span className="accrej-desc">
                                {assessment?.title}
                            </span>
                        </span>
                        <span className="accrej-txtblk">
                            <span className="accrej-label">
                                Assessment type <span>:</span>
                            </span>
                            
                            {/* {assessment?.assessmentType} */}
                            {assessment?.assessmentType?.length <= 41 ? (
                                <span className="accrej-desc">{assessment?.assessmentType}</span>
                            ) : (
                                <Tooltip title={assessment?.assessmentType}>
                                    <span className="accrej-desc">
                                        {" "}
                                        {assessment?.assessmentType?.slice(0, 44)}...
                                    </span>
                                </Tooltip>
                            )}
                        </span>
                        <span className="accrej-txtblk">
                            <span className="accrej-label">
                                Member company <span>:</span>
                            </span>
                            <span className="accrej-desc">
                                {assessment?.assignedMember?.companyName}
                            </span>
                        </span>
                        <span className="accrej-txtblk">
                            <span className="accrej-label">
                                Due date <span>:</span>
                            </span>
                            <span className="accrej-desc">
                                {new Date(
                                    new Date(assessment?.dueDate).setDate(
                                        new Date(
                                            assessment?.dueDate
                                        ).getDate() - 1
                                    )
                                ).toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                            </span>
                        </span>
                        Click “Accept” if you want to fill out the assessment.
                        Or else, provide a reason and reject the assessment, if
                        you don’t want to continue with it.
                    </p>
                }
                info2={
                    <Controller
                        name="comment"
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                multiline
                                {...field}
                                onBlur={(e) =>
                                    setValue("comment", e.target.value?.trim())
                                }
                                inputProps={{
                                    maxLength: 250,
                                }}
                                className={`input-textarea ${
                                    error && "input-textarea-error"
                                }`}
                                style={{ marginBottom: "10px" }}
                                id="outlined-basic"
                                placeholder="Enter reason"
                                helperText={
                                    error
                                        ? helperTextForReason.comment[
                                              error.type
                                          ]
                                        : " "
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
                onSecondaryModalButtonClickHandler={handleSubmit(
                    onSubmitReason
                )}
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
                        Are you sure you want to edit the given submitted
                        assessment?
                    </p>
                }
                primaryButtonText={"Yes"}
                secondaryButtonText={"No"}
                onPrimaryModalButtonClickHandler={() =>
                    handleReOpenAssessment()
                }
                onSecondaryModalButtonClickHandler={() =>
                    handleCloseReopenAssessment()
                }
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
                                    file
                                        ? "upload-file-blk selected-file-blk"
                                        : "upload-file-blk"
                                }
                            >
                                <input
                                    type={"file"}
                                    hidden
                                    accept={".xls, .xlsx"}
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
                onSecondaryModalButtonClickHandler={() => cancelImport()}
                openModal={importOpenDialog}
                setOpenModal={setImportOpenDialog}
                isModalForm={true}
                handleCloseRedirect={cancelImport}
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
                        <h2 className="heading2">{questionnaire.title}</h2>
                        <div className="flex-between">
                            <div
                                className="tertiary-btn-blk mr-20"
                                onClick={viewInstruction}
                            >
                                <span className="preview-icon">
                                    <VisibilityOutlinedIcon />
                                </span>
                                <span className="addmore-txt">
                                    View Instructions
                                </span>
                            </div>

                            <span
                                className="form-header-right-txt"
                                onClick={handleToggle}
                            >
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
                                        <li
                                            onClick={() =>
                                                handleDownloadAssessment()
                                            }
                                        >
                                            Export to Excel
                                        </li>
                                        {params["*"].includes("view") || (
                                            <li
                                                onClick={() =>
                                                    setImportOpenDialog(true)
                                                }
                                            >
                                                Import File
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </span>
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
                                        {questionnaire?.sections?.map(
                                            (section, index, id) => (
                                                <Tooltip
                                                    key={section?.uuid}
                                                    title={section.sectionTitle}
                                                    placement="bottom-start"
                                                >
                                                    <Tab
                                                        className="section-tab-item"
                                                        label={`section ${
                                                            index + 1
                                                        }`}
                                                        {...a11yProps(index)}
                                                    />
                                                </Tooltip>
                                            )
                                        )}
                                    </Tabs>
                                </Box>
                            </div>
                        </div>
                        {isFillAssessmentLoading ? (
                            <Loader />
                        ) : (
                            <div className="preview-tab-data">
                                {questionnaire?.sections?.map(
                                    (section, index) => (
                                        <TabPanel
                                            value={value}
                                            index={index}
                                            key={section?.uuid}
                                        >
                                            <FillAssesmentSection
                                                assessmentQuestionnaire={
                                                    assessmentQuestionnaire
                                                }
                                                setAssessmentQuestionnaire={
                                                    setAssessmentQuestionnaire
                                                }
                                                section={section}
                                                errorQuestion={errorQuestion}
                                                setErrorQuestion={
                                                    setErrorQuestion
                                                }
                                                errorQuestionUUID={
                                                    errorQuestionUUID
                                                }
                                                setErrorQuestionUUID={
                                                    setErrorQuestionUUID
                                                }
                                                errors={
                                                    errors[section?.uuid] ?? {}
                                                }
                                                handleFormSubmit={
                                                    handleFormSubmit
                                                }
                                                editMode={editMode}
                                                setEditMode={setEditMode}
                                            />
                                        </TabPanel>
                                    )
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

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Tab, Tabs, TextField, Tooltip } from "@mui/material";
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
    SUBMIT_ASSESSMENT_AS_DRAFT,
} from "../../api/Url";
import Loader2 from "../../assets/Loader/Loader2.svg";
import DialogBox from "../../components/DialogBox";
import Toaster from "../../components/Toaster";
import { downloadFunction } from "../../utils/downloadFunction";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import FillAssesmentSection from "./FillAssessmentSection";

export const AlphaRegEx = /^[a-zA-Z ]*$/;
export const NumericRegEx = /^[0-9]+$/i;
export const AlphaNumRegEx = /^[a-z0-9]+$/i;
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
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState("");

    const { handleSubmit, control, setValue } = useForm({
        // defaultValues: {
        //     comment: "",
        // },
    });
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
        navigate("/assessments/instructions");
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

    console.log(
        "both user are same",
        userAuth._id === assessment?.assignedOperationMember?._id
    );

    console.log(
        "first user ",
        userAuth._id +
            "  second user  " +
            assessment?.assignedOperationMember?._id
    );
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
    console.log("params", params["*"].includes("view"));
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
                console.log("response from fetch questionnaire", response);
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
                setIsLoading(true);
                const response = await privateAxios.get(
                    `${FETCH_ASSESSMENT_BY_ID}${params.id}`,
                    {
                        signal: controller.signal,
                    }
                );
                setIsLoading(false);
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
                setIsLoading(false);
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

    const saveAssessmentAsDraft = async (saveAsDraft) => {
        console.log("Save function called");
        try {
            const response = await privateAxios.post(
                saveAsDraft
                    ? SUBMIT_ASSESSMENT_AS_DRAFT + params.id
                    : SUBMIT_ASSESSMENT_AS_DRAFT + params.id + "/submit",
                {
                    ...assessmentQuestionnaire,
                }
            );
            console.log("Assessment is saved as draft", response);
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
            console.log("error from save assessment as draft", error);
            if (error?.response?.status === 401) {
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
            } else {
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
        }
    };

    const handleFormSubmit = (e, saveAsDraft) => {
        e.preventDefault();
        const tempErrors = {};
        let sections = [];
        questionnaire?.sections?.map((section, index) => {
            let sectionErrors = errors[section?.uuid] ?? {};
            let currentSectionAnswers =
                assessmentQuestionnaire[section?.uuid] ?? {};

            if (section?.layout === "table") {
                const transformedColValues = getTransformedColumns(
                    section?.columnValues
                );

                section?.rowValues.map((row) => {
                    row?.cells?.map((cell) => {
                        console.log(
                            "table layout cell",
                            transformedColValues[cell?.columnId]
                        );
                        if (
                            transformedColValues[cell?.columnId].columnType !==
                                "prefilled" &&
                            saveAsDraft === false &&
                            (!currentSectionAnswers[
                                `${cell?.columnId}.${row?.uuid}`
                            ] ||
                                currentSectionAnswers[
                                    `${cell?.columnId}.${row?.uuid}`
                                ].length === 0)
                        ) {
                            sectionErrors[`${cell?.columnId}.${row?.uuid}`] =
                                "This is required field";
                            sections.push(index);
                        } else if (
                            transformedColValues[cell?.columnId].columnType !==
                                "prefilled" &&
                            transformedColValues[cell?.columnId]?.validation ==
                                "alphabets" &&
                            currentSectionAnswers[
                                `${cell?.columnId}.${row?.uuid}`
                            ]?.length > 0 &&
                            !AlphaRegEx.test(
                                currentSectionAnswers[
                                    `${cell?.columnId}.${row?.uuid}`
                                ]
                            )
                        ) {
                            sectionErrors[`${cell?.columnId}.${row?.uuid}`] =
                                "This is alphabets only field";
                            console.log("in table alphabets only");
                            sections.push(index);
                        } else if (
                            transformedColValues[cell?.columnId].columnType !==
                                "prefilled" &&
                            transformedColValues[cell?.columnId]?.validation ==
                                "numeric" &&
                            currentSectionAnswers[
                                `${cell?.columnId}.${row?.uuid}`
                            ]?.length > 0 &&
                            !NumericRegEx.test(
                                currentSectionAnswers[
                                    `${cell?.columnId}.${row?.uuid}`
                                ]
                            )
                        ) {
                            sectionErrors[`${cell?.columnId}.${row?.uuid}`] =
                                "This is numeric only field";
                            console.log("in table numeric only");
                            sections.push(index);
                        } else if (
                            transformedColValues[cell?.columnId].columnType !==
                                "prefilled" &&
                            transformedColValues[cell?.columnId]?.validation ==
                                "alphanumeric" &&
                            currentSectionAnswers[
                                `${cell?.columnId}.${row?.uuid}`
                            ]?.length > 0 &&
                            !AlphaNumRegEx.test(
                                currentSectionAnswers[
                                    `${cell?.columnId}.${row?.uuid}`
                                ]
                            )
                        ) {
                            sectionErrors[`${cell?.columnId}.${row?.uuid}`] =
                                "This is alphanumeric field";
                            console.log("in table alphanumeric only");
                            sections.push(index);
                        } else {
                            delete sectionErrors[
                                `${cell?.columnId}.${row?.uuid}`
                            ];
                        }
                    });
                });
            } else {
                // form validators
                section?.questions.map((question) => {
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
                        console.log("error from numric if elese");
                        console.log(
                            NumericRegEx.test(
                                currentSectionAnswers[question?.uuid]
                            )
                        );
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

            console.log("sections array = ", sections);
            console.log("sections index[0] = ", sections[0]);
            setTabValue(sections.length > 0 ? sections[0] : 0);

            tempErrors[section?.uuid] = { ...sectionErrors };
        });

        handleSetErrors(tempErrors);
        const isValidated = Object.keys(tempErrors).every(
            (key) => Object.keys(tempErrors[key]).length === 0
        );
        if (isValidated) {
            saveAssessmentAsDraft(saveAsDraft);
        }
    };

    // API for declining assessments
    const onSubmitReason = async (data) => {
        console.log("comment", data);
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
            console.log("error response from backen decline assessment");
            if (error?.response?.status === 401) {
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
            } else {
                setToasterDetails(
                    {
                        titleMessage: "Success",
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
        }
        setOpenDeleteDialogBox(false);
    };

    //API for accepting assessments
    const onAcceptAssessments = async () => {
        try {
            const response = await privateAxios.post(
                ACCEPT_ASSESSMENT + params.id + "/accept"
            );
            console.log(" response from backen accept assessment");
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
            console.log("error response from backend accept assessment");
            if (error?.response?.status === 401) {
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
            } else {
                setToasterDetails(
                    {
                        titleMessage: "error",
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
            setOpenDeleteDialogBox(false);
        }
    };

    useEffect(() => {
        console.log("UseEffect Errors", errors);
    }, [errors]);

    const [isActive, setActive] = useState("false");
    const handleToggle = () => {
        setActive(!isActive);
    };

    const handleCloseRedirect = () => {
        navigate("/assessment-list");
    };

    const handleReOpenAssessment = () => {
        saveAssessmentAsDraft(true);
        setReOpenAssessmentDialogBox(false);
    };
    const handleCloseReopenAssessment = () => {
        setReOpenAssessmentDialogBox(false);
        navigate("/assessment-list");
    };

    const handleImportExcel = (e) => {
        // console.log("Selected files = ", e);
        // let d = [{ name: "madhav" }];
        if (e.target.files) {
            // let encFile = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                let result = reader.result;
                setFile(
                    CryptoJs.AES.encrypt(result, "my-secret-key@123").toString()
                );
            };

            // setFile(encFile);
        }
    };
    console.log("file selected enc", file);

    const decryptFile = (file1) => {
        console.log("file selected in dec", file1);

        let decryptData = CryptoJs.AES.decrypt(
            file1,
            "my-secret-key@123"
        ).toString(CryptoJs.enc.Utf8);
        console.log("Decrypt Data ", decryptData);
        let file = decryptData.split(",");
        let fileType = file[0];
        let fileContent = file[1];
        let a = document.createElement("a");
        a.href = `${fileType},` + fileContent;
        a.download = "QKD_download";
        a.click();
    };

    return (
        <div className="page-wrapper">
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
                            <span className="accrej-desc">
                                {assessment?.assessmentType}
                            </span>
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
                                {/* {new Date(
                                    assessment?.dueDate
                                ).toLocaleDateString()} */}
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
                        Click “Accept” if you want to fill out the assessment .
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
                                Assessment
                            </a>
                        </li>

                        <li>Fill Assessment</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
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
                                        display: isActive ? "none" : "block",
                                    }}
                                >
                                    <ul className="crud-toggle-list">
                                        <li
                                            onClick={() =>
                                                downloadFunction(
                                                    "Assessment",
                                                    setToasterDetails,
                                                    params.id,
                                                    myRef,
                                                    DOWNLOAD_ASSESSMENT_BY_ID
                                                )
                                            }
                                        >
                                            Export to Excel
                                        </li>
                                        <li>
                                            <input
                                                type={"file"}
                                                // value={file}
                                                onChange={handleImportExcel}
                                            />
                                            Import file
                                        </li>
                                        <li onClick={() => decryptFile(file)}>
                                            decrypt file
                                        </li>
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
                        {isLoading ? (
                            <div className="loader-blk">
                                <img src={Loader2} alt="Loading" />
                            </div>
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
                                                // handleSetErrors={handleSetErrors}
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
